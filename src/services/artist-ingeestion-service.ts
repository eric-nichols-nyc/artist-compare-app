import { google } from 'googleapis';
import { youtube_v3 } from 'googleapis';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

config();

const youtube = google.youtube('v3');
const LASTFM_API_KEY = process.env.LASTFM_API_KEY!;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

interface LastFmArtistInfo {
    name: string;
    bio: string;
    tags: Array<{ name: string }>;
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
    statistics: youtube_v3.Schema$ChannelStatistics;
}

export class ArtistIngestionService {
    private async getLastFmArtistInfo(artistName: string): Promise<LastFmArtistInfo> {
        const response = await fetch(
            `http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`
        );
        const data = await response.json() as LastFmResponse;
        return data.artist;
    }

    private async getYoutubeChannelInfo(artistName: string): Promise<YoutubeChannelInfo | null> {
        try {
            const searchResponse = await youtube.search.list({
                key: YOUTUBE_API_KEY,
                part: ['id'],
                q: `${artistName} official`,
                type: ['channel'],
                maxResults: 1
            });

            const channelId = searchResponse.data.items?.[0]?.id?.channelId;
            if (!channelId) {
                return null;
            }

            const channelResponse = await youtube.channels.list({
                key: YOUTUBE_API_KEY,
                part: ['statistics'],
                id: [channelId]
            });

            const channelStats = channelResponse.data.items?.[0]?.statistics;
            if (!channelStats) {
                return null;
            }

            return {
                id: channelId,
                statistics: channelStats
            };
        } catch (error) {
            console.error('Error fetching YouTube channel:', error);
            return null;
        }
    }

    private async getYoutubeVideos(channelId: string) {
        const response = await youtube.search.list({
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

        const videosResponse = await youtube.videos.list({
            key: YOUTUBE_API_KEY,
            part: ['snippet', 'statistics'],
            id: videoIds
        });

        return videosResponse.data.items || [];
    }

    public async ingestArtist(artistName: string) {
        try {
            const [lastFmData, youtubeData] = await Promise.all([
                this.getLastFmArtistInfo(artistName),
                this.getYoutubeChannelInfo(artistName)
            ]);

            const { data: artist, error: artistError } = await supabase
                .from('artists')
                .insert({
                    name: artistName,
                    spotify_id: null,
                    last_fm_id: lastFmData.name,
                    youtube_channel_id: youtubeData?.id || null,
                    bio: lastFmData.bio,
                    genres: lastFmData.tags.map(tag => tag.name)
                })
                .select()
                .single();

            if (artistError || !artist) {
                throw new Error(`Failed to insert artist: ${artistError?.message}`);
            }

            await supabase
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

            if (youtubeData?.id) {
                const videos = await this.getYoutubeVideos(youtubeData.id);
                const videoInserts = videos
                    .filter(video => video.snippet && video.statistics)
                    .map(video => ({
                        artist_id: artist.id,
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
                    await supabase
                        .from('artist_videos')
                        .insert(videoInserts);
                }
            }

            if (lastFmData.similar) {
                const similarArtists = await Promise.all(
                    lastFmData.similar.artist.map(async (similarArtist) => {
                        const { data: existingArtist } = await supabase
                            .from('artists')
                            .select()
                            .eq('name', similarArtist.name)
                            .single();

                        if (!existingArtist) {
                            await this.ingestArtist(similarArtist.name);
                        }

                        return {
                            artist_id: artist.id,
                            similar_artist_id: existingArtist?.id,
                            similarity_score: parseFloat(similarArtist.match)
                        };
                    })
                );

                await supabase
                    .from('artist_similarities')
                    .insert(similarArtists);
            }

            return artist;
        } catch (error) {
            console.error('Error in artist ingestion:', error);
            throw error;
        }
    }
}