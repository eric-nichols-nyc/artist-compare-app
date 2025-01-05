import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';
import { YoutubeVideoStatistics, YoutubeChannelInfo } from '@/types';
import {YoutubeVideoInfo} from "@/validations/artist-schema"

if (!process.env.NEXT_PUBLIC_YOUTUBE_API) {
    throw new Error('Missing YOUTUBE_API_KEY environment variable');
}



export class YoutubeService {
    private youtube;
    private lastRequestTime: number = 0;
    private readonly API_KEY: string;
    private memoryCache: Map<string, { data: YoutubeVideoInfo[], timestamp: number }>;

    constructor() {
        this.API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API!;
        this.youtube = google.youtube('v3');
        this.memoryCache = new Map();
    }

    private async rateLimitRequest<T>(request: Promise<T>): Promise<T> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < 100) { // Ensure 100ms between requests
            await new Promise(resolve => setTimeout(resolve, 100 - timeSinceLastRequest));
        }
        
        try {
            const result = await request;
            this.lastRequestTime = Date.now();
            return result;
        } catch (error) {
            console.error('YouTube API error:', error);
            throw error;
        }
    }

    public getChannelInfo = unstable_cache(async (artistName: string, cid?: string | undefined | null): Promise<YoutubeChannelInfo | null> => {
        try {
            console.log('Making fresh YouTube API call for:', artistName);
            let channelId = cid;

            if (!channelId) {
                const searchResponse = await this.rateLimitRequest(
                    this.youtube.search.list({
                        key: this.API_KEY,
                        part: ['id'],
                        q: `${artistName} topic`,
                        type: ['channel'],
                        order: 'relevance',
                        relevanceLanguage: 'en',
                        maxResults: 1
                    })
                );

                channelId = searchResponse.data.items?.[0]?.id?.channelId;
            }

            if (!channelId) return null;

            // Get channel statistics
            const channelResponse = await this.rateLimitRequest(
                this.youtube.channels.list({
                    key: this.API_KEY,
                    part: ['statistics'],
                    id: [channelId]
                })
            );

            const channelStats = channelResponse.data.items?.[0]?.statistics;
            if (!channelStats) return null;

            return {
                id: channelId,
                statistics: {
                    viewCount: parseInt(channelStats.viewCount || '0'),
                    subscriberCount: parseInt(channelStats.subscriberCount || '0'),
                    videoCount: parseInt(channelStats.videoCount || '0')
                },
                fetchedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching YouTube channel:', error);
            return null;
        }
    }, [`youtube-channel-info-${Date.now()}`]);

    public getTopPlaylistVideos = unstable_cache(async (playlistId: string) => {
        if(!playlistId){
            throw new Error('PlaylistID is required')
        }


        try {
            const playlistResponse = await this.rateLimitRequest(
                this.youtube.playlistItems.list({
                    key: this.API_KEY,
                    part: ['snippet', 'contentDetails'],
                    playlistId: playlistId,
                    maxResults: 50
                })
            );

            return playlistResponse.data.items;
        } catch (error) {
            console.error('Error fetching YouTube playlist:', error);
            return [];
        }

    }, ['youtube-playlist-videos'], { tags: ['youtube-playlist-videos'], revalidate: 60 * 60 * 24 });

    public getChannelTopVideos = unstable_cache(async (channelId: string): Promise<YoutubeVideoInfo[]> => {
        if(!channelId){
            throw new Error('ChannelID is required')
        }
        try {
            const searchResponse = await this.rateLimitRequest(
                this.youtube.search.list({
                    key: this.API_KEY,
                    part: ['id', 'snippet'],
                    channelId: channelId,
                    type: ['video'],
                    order: 'viewCount',
                    maxResults: 5
                })
            );

            if (!searchResponse.data.items?.length) return [];

            const videoIds = searchResponse.data.items
                .map(item => item.id?.videoId)
                .filter((id): id is string => id !== undefined);

            const videosResponse = await this.rateLimitRequest(
                this.youtube.videos.list({
                    key: this.API_KEY,
                    part: ['snippet', 'statistics', 'contentDetails'],
                    id: videoIds
                })
            );

            console.log('videosResponse ========== ', videosResponse)

            return (videosResponse.data.items || []).map(video => ({
                title: video.snippet?.title ?? '',
                videoId: video.id ?? '',
                platform: 'youtube',
                thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
                publishedAt: video.snippet?.publishedAt ?? '',
                viewCount: parseInt(video.statistics?.viewCount ?? '0'),
                likeCount: parseInt(video.statistics?.likeCount ?? '0'),
                commentCount: parseInt(video.statistics?.commentCount ?? '0')
            }));
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }, ['youtube-channel-videos'], { tags: ['youtube-channel-videos'], revalidate: 60 * 60 * 24 });

    public getVideosByIds = unstable_cache(async (videoIds: string | string[]): Promise<YoutubeVideoInfo[]> => {
        const cacheKey = Array.isArray(videoIds) ? videoIds.join(',') : videoIds;
        
        // Check memory cache first
        const cached = this.memoryCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
            console.log('✅ Found in memory cache:', cacheKey);
            return cached.data;
        }

        console.log('❌ Not in memory cache, checking YouTube API:', cacheKey);
        
        if (!videoIds) {
            throw new Error('Video IDs are required');
        }

        // Convert string of IDs to array if needed
        const ids = Array.isArray(videoIds) 
            ? videoIds 
            : videoIds.split(',').map(id => id.trim());

        try {
            console.log('Cache MISS - Fetching from YouTube API:', ids);
            const videosResponse = await this.rateLimitRequest(
                this.youtube.videos.list({
                    key: this.API_KEY,
                    part: ['snippet', 'statistics', 'contentDetails'],
                    id: ids
                })
            );

            const results = (videosResponse.data.items || []).map(video => ({
                title: video.snippet?.title ?? '',
                videoId: video.id ?? '',
                platform: 'youtube',
                thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
                publishedAt: video.snippet?.publishedAt ?? '',
                viewCount: parseInt(video.statistics?.viewCount ?? '0'),
                likeCount: parseInt(video.statistics?.likeCount ?? '0'),
                commentCount: parseInt(video.statistics?.commentCount ?? '0')
            }));

            console.log('YouTube API response received for:', ids);

            // Store in memory cache
            this.memoryCache.set(cacheKey, {
                data: results,
                timestamp: Date.now()
            });

            return results;
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }, 
    [`youtube-videos-by-ids`],
    { tags: ['youtube-videos-by-ids'], revalidate: 60 * 60 * 24 });

    public formatVideoStats(statistics: YoutubeVideoStatistics): string {
        const views = statistics.viewCount ? statistics.viewCount.toLocaleString() : 0;
        const likes = statistics.likeCount ? statistics.likeCount.toLocaleString() : '0';
        return `${views} views • ${likes} likes`;
    }

    public formatDuration(duration: string): string {
        // Convert ISO 8601 duration to readable format
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return '';

        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');

        const parts = [];
        if (hours) parts.push(hours.padStart(2, '0'));
        parts.push(minutes.padStart(2, '0') || '00');
        parts.push(seconds.padStart(2, '0') || '00');

        return parts.join(':');
    }
} 