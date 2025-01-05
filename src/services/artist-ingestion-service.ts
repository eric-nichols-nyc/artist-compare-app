import { unstable_cache } from 'next/cache';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { SpotifyService } from './spotify-service';
import { MusicBrainzService } from './music-brainz-service';
import { ArtistFormState, YoutubeVideoInfo, SpotifyTrackInfo, ArtistAnalytics } from "@/validations/artist-schema"
import { LastFmResponse } from '@/types';
import { YoutubeService } from './youtube-service';
// Initialize environment variables
if (typeof window === 'undefined') {
    config();
}

export interface LastFmArtistInfo {
    name: string;
    mbid: string;
    lfmUrl: string;
    fmListeners: string;
    fmPlayCount: string;
    bio:string;
    selected?: boolean | null;
}


export interface SimilarArtist {
    id: string;
    name: string;
    imageUrl: string | null;
    genres: string[];
    match: number | null;
    selected?: boolean | null;
}

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!LASTFM_API_KEY || !YOUTUBE_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing required environment variables');
}

export class ArtistIngestionService {
    private supabase;
    private musicBrainzService: MusicBrainzService;
    private youtubeService: YoutubeService;

    constructor() {
        this.youtubeService = new YoutubeService();
        this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        this.musicBrainzService = new MusicBrainzService();
    }

    private async testConnection() {
        try {
            const { data, error } = await this.supabase
                .from('artists')
                .select('id')
                .limit(1);
            
            if (error) {
                console.error('Supabase connection test failed:', error);
            } else {
                console.log('Supabase connection test successful');
            }
        } catch (error) {
            console.error('Supabase connection test error:', error);
        }
    }

    /**
     * Fetch artist information from Last.fm API
     */
    public getLastFmSimilarArtistInfo = unstable_cache(async (artistName: string) => {
        try {
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`
            );
            const data = await response.json() as LastFmResponse;
            return data.similarartists.artist;
        } catch (error) {
            console.error('Error fetching Last.fm artist info:', error);
            throw error;
        }
    }, ['lastfm-similar-artist-info'], { tags: ['lastfm-similar-artist-info'], revalidate: 60 * 60 * 24 });

    // fetch lastFm artist info
    public getLastFmArtistInfo = unstable_cache(async (artistName: string): Promise<LastFmArtistInfo> => {
        try {
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`
            );
            const data = await response.json();

            const fromattedArtist = {
                name: data.artist.name,
                mbid: data.artist.mbid,
                lfmUrl: data.artist.url,
                fmListeners: data.artist.stats.listeners,
                fmPlayCount: data.artist.stats.playcount,
                bio: data.artist.bio.summary,
            }
            return fromattedArtist;
        } catch (error) {
            console.error('Error fetching Last.fm artist info:', error);
            throw error;
        }
    }, ['lastfm-artist-info'], { tags: ['lastfm-artist-info'], revalidate: 60 * 60 * 24 });

    /**
     * Fetch YouTube channel information for an artist
     */
    public getYoutubeChannelInfo = async (artistName: string, channelId?: string) => {
        return this.youtubeService.getChannelInfo(artistName, channelId);
    }

    /**
     * Fetch top videos from a YouTube channel
     */
    public getYoutubeVideos = async (channelId: string) => {
        return this.youtubeService.getChannelTopVideos(channelId);
    }

    public getSpotifyArtistData = unstable_cache(async (artistName: string) => {
        const spotifyArtist = await SpotifyService.searchArtist(artistName);
        return spotifyArtist;
    }, ['spotify-artist-data'], { tags: ['spotify-artist-data'], revalidate: 60 * 60 * 24 });

    // get artist musicbrainz id
    public getArtistmusicbrainzId = unstable_cache(async (artistName: string) => {
        try {
            const response = await fetch(
                `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(artistName)}&fmt=json`,
                {
                    headers: {
                        'User-Agent': 'ArtistIngestionService/1.0.0 (ebn646@gmail.com)'  // Replace with your app info
                    }
                }
            );
            const data = await response.json() as any;

            return data.artists[0]?.id;
        } catch (error) {
            console.error('Error fetching MusicBrainz artist info:', error);
            throw error;
        }

    }, ['artist-musicbrainz-id'], { tags: ['artist-musicbrainz-id'], revalidate: 60 * 60 * 24 });

    public getArtistMusicBrainzInfo = unstable_cache(async (artistId: string) => {
        // return id, name, bio, gender, country, life-span
        const response = await fetch(
            `https://musicbrainz.org/ws/2/artist/${artistId}?inc=biography&fmt=json`,
            {
                headers: {
                    'User-Agent': 'ArtistIngestionService/1.0.0 (ebn646@gmail.com)'  // Replace with your app info
                }
            }
        );
        const data = await response.json() as any;
        // console.log('musicbrainz data', data);
        return data.mbid;
    }, ['artist-musicbrainz-info'], { tags: ['artist-musicbrainz-info'], revalidate: 60 * 60 * 24 });

    // get artist info  return bio, spotifyId, lastfmId, youtubeChannelId, genres, imageUrl
    public async getArtistInfo(name: string) {
        // Run all API calls concurrently
        const [lastfm, musicbrainzInfo, youtubeChannel] = await Promise.all([
            this.getLastFmArtistInfo(name),
            this.musicBrainzService.getArtistDetails(name),
            this.getYoutubeChannelInfo(name)
        ]);

        console.log('lastfm artist info = ', lastfm);
        console.log('musicbrainzInfo =============================', musicbrainzInfo);

        if (!musicbrainzInfo) {
            throw new Error('Could not find artist info in MusicBrainz');
        }
        console.log('youtubeChannel =============================', youtubeChannel);    

        const { id, gender, country, activeYears } = musicbrainzInfo;
        const musicbrainzId = id;
        const youtubeChannelId = youtubeChannel?.id;

        return {
            musicbrainzId,
            lastFmUrl: lastfm.lfmUrl,
            lastfmPlayCount: parseInt(lastfm.fmPlayCount),
            lastfmListeners: parseInt(lastfm.fmListeners),
            youtubeChannelId,
            youtubeChannelStats: {
                subscriberCount: youtubeChannel?.statistics?.subscriberCount ?? 0,
                viewCount: youtubeChannel?.statistics?.viewCount ?? 0
            },
            biography: lastfm.bio,
            gender,
            country,
            born: activeYears.begin,
            died: activeYears.end
        }
    }

    public async addArtist(artist: ArtistFormState) {
        try {
            const artistInsert = {
                id: crypto.randomUUID(),
                name: artist.artistInfo.name,
                spotify_id: artist.artistInfo.spotifyId,
                musicbrainz_id: artist.artistInfo.musicbrainzId,
                youtube_channel_id: artist.artistInfo.youtubeChannelId,
                bio: artist.artistInfo.bio,
                genres: artist.artistInfo.genres,
                gender: artist.artistInfo.gender,
                country: artist.artistInfo.country,
                birth_date: artist.artistInfo.birthDate,
                birth_place: artist.artistInfo.birthPlace,
                image_url: artist.artistInfo.imageUrl,
                youtube_url: artist.artistInfo.youtubeUrl,
                spotify_url: artist.artistInfo.spotifyUrl,
                tiktok_url: artist.artistInfo.tiktokUrl,
                instagram_url: artist.artistInfo.instagramUrl,
                viberate_url: artist.artistInfo.viberateUrl,
                youtube_charts_url: artist.artistInfo.youtubeChartsUrl,
                song_stats_url: artist.artistInfo.songStatsUrl,
                updated_at: new Date().toISOString()
            };

            const { data: artistData, error: artistError } = await this.supabase
                .from('artists')
                .insert(artistInsert)
                .select()
                .single();

            if (artistError) {
                console.error('Supabase Error Details:', {
                    code: artistError.code,
                    message: artistError.message,
                    details: artistError.details,
                    hint: artistError.hint
                });
                throw new Error(`Failed to insert artist: ${artistError.message} (Code: ${artistError.code})`);
            }

            if (!artistData) {
                throw new Error('No data returned from insert operation');
            }

            // Now we have the artist ID, we can process the related data
            await Promise.all([
                this.processAnalytics(artist.analytics, artistData.id),
                this.processYoutubeVideos(artist.videos, artistData.id),
                this.processSpotifyTracks(artist.tracks, artistData.id),
            ]);

            return {
                success: true,
                message: 'Artist added successfully',
                artistId: artistData.id
            };
        } catch (error) {
            console.error('Full error object:', error);
            throw error;
        }
    }

    /**
     * Process and store YouTube videos for an artist
     */
    private async processYoutubeVideos(videos: YoutubeVideoInfo[], artistId: string) {
        try {
            if (!videos.length) return;

            const videoInserts = videos.map(video => ({
                id: crypto.randomUUID(),
                artist_id: artistId,
                youtube_id: video.videoId,
                title: video.title,
                view_count: video.viewCount,
                like_count: video.likeCount,
                updated_at: new Date().toISOString()
            }));

            const { error } = await this.supabase
                .from('artist_videos')
                .insert(videoInserts);

            if (error) throw error;
        } catch (error) {
            console.error('Error processing YouTube videos:', error);
            throw error;
        }
    }

    private async processSpotifyTracks(tracks: SpotifyTrackInfo[], artistId: string) {
        try {
            const trackInserts = tracks.map(track => ({
                id: crypto.randomUUID(),
                artist_id: artistId,
                platform_track_id: track.trackId,
                title: track.title,
                popularity: track.popularity,
                platform: 'spotify'
            }));

            const { error } = await this.supabase
                .from('artist_top_tracks')
                .insert(trackInserts);

            if (error) throw error;
        } catch (error) {
            console.error('Error processing Spotify tracks:', error);
            throw error;
        }
    };

    /**
     * Process and store similar artists
     */
    private async processSimilarArtists(similarArtists: SimilarArtist[], artistId: string) {
        try {
            const similarArtistsData = await Promise.all(
                similarArtists.map(async (similarArtist) => {
                    const { data: existingArtist } = await this.supabase
                        .from('artists')
                        .select()
                        .eq('name', similarArtist.name)
                        .single();

                    return {
                        id: crypto.randomUUID(),
                        artist_id: artistId,
                        similar_artist_id: existingArtist?.id,
                        similarity_score: similarArtist.match
                    };
                })
            );

            await this.supabase
                .from('artist_similarities')
                .insert(similarArtistsData);
        } catch (error) {
            console.error('Error processing similar artists:', error);
            throw error;
        }
    };

    private async processAnalytics(analytics: ArtistAnalytics, artistId: string) {
        try {
            const analyticsInsert = {
                id: crypto.randomUUID(),
                artist_id: artistId,
                date: new Date().toISOString().split('T')[0],
                spotify_monthly_listeners: analytics.spotifyMonthlyListeners,
                lastfm_monthly_listeners: analytics.lastFmMonthlyListeners,
                youtube_subscribers: analytics.youtubeSubscribers,
                youtube_total_views: analytics.youtubeTotalViews,
                lastfm_play_count: analytics.lastfmPlayCount,
                spotify_followers: analytics.spotifyFollowers,
                spotify_popularity: analytics.spotifyPopularity,
                instagram_followers: analytics.instagramFollowers,
                facebook_followers: analytics.facebookFollowers,
                tiktok_followers: analytics.tiktokFollowers,
                soundcloud_followers: analytics.soundcloudFollowers
            };

            const { error } = await this.supabase
                .from('artist_analytics')
                .insert(analyticsInsert);

            if (error) throw error;
        } catch (error) {
            console.error('Error processing analytics:', error);
            throw error;
        }
    }

    public async updateArtist(artistId: string, data: any) {
        const artist = await this.supabase
            .from('artists')
            .update(data)
            .eq('id', artistId)
            .select()
            .single();
        return artist;
    }
}