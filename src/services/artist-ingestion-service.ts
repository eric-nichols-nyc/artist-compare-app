import { google } from 'googleapis';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';
import { SpotifyService } from './spotify-service';
import OpenAI from 'openai';
import type { PreviewArtistResponse } from "@/types/api"
import { ArtistFormValues } from '@/lib/validations/artist';
import { LastFmArtistInfo, LastFmResponse } from '@/types/api';
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


interface YoutubeChannelInfo {
    id: string;
    statistics: any;
    topVideos?: Array<{
        id?: string;
        title?: string;
        thumbnail?: string;
        publishedAt?: string;
        statistics?: {
            viewCount?: string | null | undefined;
            likeCount?: string | null | undefined;
            commentCount?: string | null | undefined;
        };
        
        duration?: string;
    }>;
}

export class ArtistIngestionService {
    private youtube;
    private supabase;
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    constructor() {
        this.youtube = google.youtube('v3');
        this.supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
    }

    /**
     * Fetch artist information from Last.fm API
     */
    public async getLastFmArtistInfo(artistName: string): Promise<LastFmArtistInfo> {
        try {
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`
            );
            const data = await response.json() as LastFmResponse;
            console.log('lastfm data', data);
            return data.similarartists.artist;
        } catch (error) {
            console.error('Error fetching Last.fm artist info:', error);
            throw error;
        }
    }

    /**
     * Fetch YouTube channel information for an artist
     */
    public async getYoutubeChannelInfo(artistName: string, cid?: string): Promise<YoutubeChannelInfo | null> {
        let channelId;
        if(!cid){
            const searchResponse = await this.youtube.search.list({
                key: YOUTUBE_API_KEY,
                part: ['id'],
                q: `${artistName} official`,
                type: ['channel'],
                maxResults: 1
            });

            channelId = searchResponse.data.items?.[0]?.id?.channelId;
        }else{
            channelId = cid;
        }
        try {
        
            if (!channelId) return null;

            // Get channel statistics
            const channelResponse = await this.youtube.channels.list({
                key: YOUTUBE_API_KEY,
                part: ['statistics'],
                id: [channelId]
            });

            const channelStats = channelResponse.data.items?.[0]?.statistics;
            if (!channelStats) return null;

            // Get top videos
            const topVideosResponse = await this.youtube.search.list({
                key: YOUTUBE_API_KEY,
                part: ['id', 'snippet'],
                channelId: channelId,
                type: ['video'],
                order: 'viewCount',
                maxResults: 5
            });

            // Get detailed video statistics
            const videoIds = topVideosResponse.data.items
                ?.map(item => item.id?.videoId)
                .filter((id): id is string => id !== undefined);

            const videoStats = videoIds ? await this.youtube.videos.list({
                key: YOUTUBE_API_KEY,
                part: ['statistics', 'contentDetails'],
                id: videoIds
            }) : null;

            // Combine video data
            const topVideos = topVideosResponse.data.items?.map((item, index) => ({
                id: item.id?.videoId ?? undefined,
                title: item.snippet?.title ?? undefined,
                thumbnail: item.snippet?.thumbnails?.high?.url ?? undefined,
                publishedAt: item.snippet?.publishedAt ?? undefined,
                statistics: videoStats?.data.items?.[index]?.statistics ?? undefined,
                duration: videoStats?.data.items?.[index]?.contentDetails?.duration ?? undefined
            }));

            return {
                id: channelId,
                statistics: channelStats,
                topVideos: topVideos || []
            };
        } catch (error) {
            console.error('Error fetching YouTube channel:', error);
            return null;
        }
    }

    /**
     * Fetch top videos from a YouTube channel
     */
    public async getYoutubeVideos(channelId: string) {
        try {
            const response = await this.youtube.search.list({
                key: YOUTUBE_API_KEY,
                part: ['id'],
                channelId: channelId,
                type: ['video'],
                order: 'viewCount',
                maxResults: 5
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

    public async getSpotifyArtistData(artistName: string) {
        const spotifyArtist = await SpotifyService.searchArtist(artistName);
        console.log('spotifyArtist', spotifyArtist);
        return spotifyArtist;
    }

    /**
     * Ingest artist data into the database using preview data
     */
    public async ingestArtist(previewData: PreviewArtistResponse) {
        console.log('========== ingestArtist', previewData.name,'====================');
        try {
            // Insert artist data
            const { data: artist, error: artistError } = await this.supabase
                .from('artists')
                .insert({
                    name: previewData.name,
                    spotify_id: previewData.spotifyId,
                    last_fm_id: previewData.lastFmId,
                    youtube_channel_id: previewData.youtubeChannelId,
                    bio: previewData.bio,
                    genres: previewData.genres,
                    image_url: previewData.imageUrl,
                    youtube_url: previewData.youtubeUrl,
                    spotify_url: previewData.spotifyUrl,
                    tiktok_url: previewData.tiktokUrl,
                    instagram_url: previewData.instagramUrl,
                })
                .select()
                .single();

            if (artistError || !artist) {
                throw new Error(`Failed to insert artist: ${artistError?.message}`);
            }

            // Fetch additional data for analytics
            const [spotifyArtist, youtubeData, lastFmData] = await Promise.all([
                previewData.spotifyId ? SpotifyService.getArtistData(previewData.spotifyId) : null,
                previewData.youtubeChannelId ? this.getYoutubeChannelInfo(previewData.name) : null,
                previewData.lastFmId ? this.getLastFmArtistInfo(previewData.name) : null,
            ]);

            // Insert analytics data if we have additional platform data
            if (spotifyArtist || youtubeData || lastFmData) {
                const socialStats = await this.getSocialMediaStats(previewData.name);
                
                await this.supabase
                    .from('artist_analytics')
                    .insert({
                        artist_id: artist.id,
                        date: new Date().toISOString().split('T')[0],
                        monthly_listeners: lastFmData ? parseInt(lastFmData.stats.listeners) : null,
                        youtube_subscribers: youtubeData?.statistics?.subscriberCount 
                            ? parseInt(youtubeData.statistics.subscriberCount) 
                            : null,
                        youtube_total_views: youtubeData?.statistics?.viewCount 
                            ? parseInt(youtubeData.statistics.viewCount) 
                            : null,
                        lastfm_play_count: lastFmData ? parseInt(lastFmData.stats.playcount) : null,
                        spotify_followers: spotifyArtist?.followers?.total || null,
                        spotify_popularity: spotifyArtist?.popularity || null,
                        instagram_followers: socialStats.instagram_followers,
                        tiktok_followers: socialStats.tiktok_followers,
                        facebook_followers: socialStats.facebook_followers
                    });
            }

            // Process YouTube videos if available
            if (previewData.youtubeChannelId) {
                await this.processYoutubeVideos(previewData.youtubeChannelId, artist.id);
            }

            // Process Spotify top tracks if available
            if (previewData.spotifyId) {
                const spotifyTopTracks = await SpotifyService.getArtistTopTracks(previewData.spotifyId);
                if (spotifyTopTracks.length > 0) {
                    const trackInserts = spotifyTopTracks.map((track: any) => ({
                        artist_id: artist.id,
                        platform_track_id: track.id,
                        name: track.name,
                        popularity: track.popularity,
                        platform: 'spotify'
                    }));

                    await this.supabase
                        .from('artist_top_tracks')
                        .insert(trackInserts);
                }
            }

            return artist;
        } catch (error) {
            console.error('Error in artist ingestion:', error);
            throw error;
        }
    }

    public async addArtist(artist: ArtistFormValues) {
        // add artist to database
        console.log('addArtist', artist);
        return "success"
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

    private async getSocialMediaStats(artistName: string) {
        const prompt = `What are the current social media follower counts for ${artistName}? 
                       Return only numbers for Instagram, TikTok, and Facebook in JSON format.
                       If exact number unknown, provide best estimate based on recent data.`;

        const response = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that provides social media statistics in JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const stats = JSON.parse(response.choices[0].message.content!);
        return {
            instagram_followers: stats.instagram,
            tiktok_followers: stats.tiktok,
            facebook_followers: stats.facebook
        };
    }

    public async updateArtistYoutubeData(artistId: string, youtubeChannelId: string) {
        const youtubeData = await this.getYoutubeVideos(youtubeChannelId);
        return youtubeData;
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