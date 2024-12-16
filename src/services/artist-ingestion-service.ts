import { google } from 'googleapis';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

// Initialize environment variables
if (typeof window === 'undefined') {
    config();
}

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!LASTFM_API_KEY || !YOUTUBE_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing required environment variables');
}

// Type definitions
interface LastFmArtistInfo {
    name: string;
    bio: string;
    tags: { tag: Array<{ name: string }> };
    stats: {
        listeners: string;
        playcount: string;
    };
    similar: {
        artist: Array<{
            name: string;
            match: string;
        }>;
    };
}

interface LastFmResponse {
    artist: LastFmArtistInfo;
}

interface YoutubeChannelInfo {
    id: string;
    statistics: any;
}

export class ArtistIngestionService {
    private youtube;
    private supabase;

    constructor() {
        this.youtube = google.youtube('v3');
        this.supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
    }

    /**
     * Fetch artist information from Last.fm API
     */
    private async getLastFmArtistInfo(artistName: string): Promise<LastFmArtistInfo> {
        try {
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`
            );
            const data = await response.json() as LastFmResponse;
            console.log('lastfm data', data);
            return data.artist;
        } catch (error) {
            console.error('Error fetching Last.fm artist info:', error);
            throw error;
        }
    }

    /**
     * Fetch YouTube channel information for an artist
     */
    private async getYoutubeChannelInfo(artistName: string): Promise<YoutubeChannelInfo | null> {
        try {
            const searchResponse = await this.youtube.search.list({
                key: YOUTUBE_API_KEY,
                part: ['id'],
                q: `${artistName} official`,
                type: ['channel'],
                maxResults: 1
            });

            const channelId = searchResponse.data.items?.[0]?.id?.channelId;
            if (!channelId) return null;

            const channelResponse = await this.youtube.channels.list({
                key: YOUTUBE_API_KEY,
                part: ['statistics'],
                id: [channelId]
            });

            const channelStats = channelResponse.data.items?.[0]?.statistics;
            if (!channelStats) return null;

            return {
                id: channelId,
                statistics: channelStats
            };
        } catch (error) {
            console.error('Error fetching YouTube channel:', error);
            return null;
        }
    }

    /**
     * Fetch top videos from a YouTube channel
     */
    private async getYoutubeVideos(channelId: string) {
        try {
            const response = await this.youtube.search.list({
                key: YOUTUBE_API_KEY,
                part: ['id'],
                channelId: channelId,
                type: ['video'],
                order: 'viewCount',
                maxResults: 50
            });

            if (!response.data.items) return [];

            const videoIds = response.data.items
                .map(item => item.id?.videoId)
                .filter((id): id is string => id !== undefined);

            const videosResponse = await this.youtube.videos.list({
                key: YOUTUBE_API_KEY,
                part: ['snippet', 'statistics'],
                id: videoIds
            });

            return videosResponse.data.items || [];
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }

    /**
     * Ingest artist data into the database
     */
    public async ingestArtist(artistName: string) {
        console.log('ingestArtist...', artistName);
        try {
            const [lastFmData, youtubeData] = await Promise.all([
                this.getLastFmArtistInfo(artistName),
                this.getYoutubeChannelInfo(artistName)
            ]);
            console.log('lastfm data', lastFmData);
            console.log('youtube data', youtubeData);

            // Insert artist data
            const { data: artist, error: artistError } = await this.supabase
                .from('artists')
                .insert({
                    name: artistName,
                    spotify_id: null,
                    last_fm_id: lastFmData.name,
                    youtube_channel_id: youtubeData?.id || null,
                    bio: lastFmData.bio,
                    genres: lastFmData.tags.tag.map(tag => tag.name)
                })
                .select()
                .single();

            if (artistError || !artist) {
                throw new Error(`Failed to insert artist: ${artistError?.message}`);
            }

            // Insert analytics data
            await this.supabase
                .from('artist_analytics')
                .insert({
                    artist_id: artist.id,
                    date: new Date().toISOString().split('T')[0],
                    monthly_listeners: parseInt(lastFmData.stats.listeners),
                    youtube_subscribers: youtubeData?.statistics.subscriberCount 
                        ? parseInt(youtubeData.statistics.subscriberCount) 
                        : null,
                    youtube_total_views: youtubeData?.statistics.viewCount 
                        ? parseInt(youtubeData.statistics.viewCount) 
                        : null,
                    lastfm_play_count: parseInt(lastFmData.stats.playcount)
                });

            // Process YouTube videos if available
            if (youtubeData?.id) {
                await this.processYoutubeVideos(youtubeData.id, artist.id);
            }

            // Process similar artists
            if (lastFmData.similar) {
                await this.processSimilarArtists(lastFmData.similar.artist, artist.id);
            }

            return artist;
        } catch (error) {
            console.error('Error in artist ingestion:', error);
            throw error;
        }
    }

    /**
     * Process and store YouTube videos for an artist
     */
    private async processYoutubeVideos(channelId: string, artistId: string) {
        const videos = await this.getYoutubeVideos(channelId);
        const videoInserts = videos
            .filter(video => video.snippet && video.statistics)
            .map(video => ({
                artist_id: artistId,
                youtube_id: video.id!,
                title: video.snippet!.title!,
                view_count: video.statistics?.viewCount 
                    ? parseInt(video.statistics.viewCount) 
                    : 0,
                like_count: video.statistics?.likeCount 
                    ? parseInt(video.statistics.likeCount) 
                    : 0,
                comment_count: video.statistics?.commentCount 
                    ? parseInt(video.statistics.commentCount) 
                    : 0,
                published_at: video.snippet!.publishedAt
            }));

        if (videoInserts.length > 0) {
            await this.supabase
                .from('artist_videos')
                .insert(videoInserts);
        }
    }

    /**
     * Process and store similar artists
     */
    private async processSimilarArtists(similarArtists: Array<{ name: string; match: string }>, artistId: string) {
        const similarArtistsData = await Promise.all(
            similarArtists.map(async (similarArtist) => {
                const { data: existingArtist } = await this.supabase
                    .from('artists')
                    .select()
                    .eq('name', similarArtist.name)
                    .single();

                if (!existingArtist) {
                    await this.ingestArtist(similarArtist.name);
                }

                return {
                    artist_id: artistId,
                    similar_artist_id: existingArtist?.id,
                    similarity_score: parseFloat(similarArtist.match)
                };
            })
        );

        await this.supabase
            .from('artist_similarities')
            .insert(similarArtistsData);
    }
}