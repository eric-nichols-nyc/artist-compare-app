import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';
import { YoutubeChannelInfo, YoutubeVideo, YoutubeVideoStatistics } from '@/types';
if (!process.env.NEXT_PUBLIC_YOUTUBE_API) {
    throw new Error('Missing YOUTUBE_API_KEY environment variable');
}



export class YoutubeService {
    private youtube;
    private lastRequestTime: number = 0;
    private readonly API_KEY: string;

    constructor() {
        this.API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API!;
        this.youtube = google.youtube('v3');
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
            let channelId = cid;

            if (!channelId) {
                const searchResponse = await this.rateLimitRequest(
                    this.youtube.search.list({
                        key: this.API_KEY,
                        part: ['id'],
                        q: `${artistName} official`,
                        type: ['channel'],
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

            // Get top videos
            const topVideos = await this.getChannelTopVideos(channelId);

            return {
                id: channelId,
                statistics: {
                    viewCount: channelStats.viewCount ?? 0,
                    subscriberCount: channelStats.subscriberCount ?? undefined,
                    videoCount: channelStats.videoCount ?? undefined
                },
                topVideos
            };
        } catch (error) {
            console.error('Error fetching YouTube channel:', error);
            return null;
        }
    }, ['youtube-channel-info'], { tags: ['youtube-channel-info'], revalidate: 60 * 60 * 24 });

    public getChannelTopVideos = unstable_cache(async (channelId: string): Promise<YoutubeVideo[]> => {
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

            return (videosResponse.data.items || []).map(video => ({
                videoId: video.id ?? '',
                title: video.snippet?.title ?? '',
                thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
                publishedAt: video.snippet?.publishedAt ?? '',
                statistics: {
                    viewCount: video.statistics?.viewCount ?? undefined,
                    likeCount: video.statistics?.likeCount ?? undefined,
                    commentCount: video.statistics?.commentCount ?? undefined
                },
                duration: video.contentDetails?.duration ?? ''
            }));
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
            return [];
        }
    }, ['youtube-channel-videos'], { tags: ['youtube-channel-videos'], revalidate: 60 * 60 * 24 });


    public formatVideoStats(statistics: YoutubeVideoStatistics): string {
        const views = statistics.viewCount ? parseInt(statistics.viewCount).toLocaleString() : 0;
        const likes = statistics.likeCount ? parseInt(statistics.likeCount).toLocaleString() : '0';
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