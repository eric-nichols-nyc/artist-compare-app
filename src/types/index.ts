import {YoutubeVideo, YoutubeVideoInfo} from "@/validations/artist-schema";
import { Analytics } from "@/types/analytics";
import { SimilarArtist } from '@/validations/artist-schema';
// export interface Database {
//     public: {
//         Tables: {
//             artists: {
//                 Row: {
//                     id: string;
//                     name: string;
//                     spotify_id: string | null;
//                     last_fm_id: string | null;
//                     youtube_channel_id: string | null;
//                     bio: string | null;
//                     genres: string[] | null;
//                     created_at: string;
//                     updated_at: string;
//                 };
//                 Insert: {
//                     id?: string;
//                     name: string;
//                     spotify_id?: string | null;
//                     last_fm_id?: string | null;
//                     youtube_channel_id?: string | null;
//                     bio?: string | null;
//                     genres?: string[] | null;
//                     created_at?: string;
//                     updated_at?: string;
//                 };
//                 Update: {
//                     id?: string;
//                     name?: string;
//                     spotify_id?: string | null;
//                     last_fm_id?: string | null;
//                     youtube_channel_id?: string | null;
//                     bio?: string | null;
//                     genres?: string[] | null;
//                     created_at?: string;
//                     updated_at?: string;
//                 };
//             };
//             artist_comparisons: {
//                 Row: {
//                     id: string;
//                     artist1_id: string;
//                     artist2_id: string;
//                     comparison_text: string;
//                     similarity_score: number | null;
//                     embedding: number[];
//                     source: string;
//                     created_at: string;
//                 };
//                 Insert: {
//                     id?: string;
//                     artist1_id: string;
//                     artist2_id: string;
//                     comparison_text: string;
//                     similarity_score?: number | null;
//                     embedding: number[];
//                     source: string;
//                     created_at?: string;
//                 };
//                 Update: {
//                     id?: string;
//                     artist1_id?: string;
//                     artist2_id?: string;
//                     comparison_text?: string;
//                     similarity_score?: number | null;
//                     embedding?: number[];
//                     source?: string;
//                     created_at?: string;
//                 };
//             };
//             artist_analytics: {
//                 Row: {
//                     id: string;
//                     artist_id: string;
//                     date: string;
//                     monthly_listeners: number | null;
//                     youtube_subscribers: number | null;
//                     youtube_total_views: number | null;
//                     lastfm_play_count: number | null;
//                     spotify_followers: number | null;
//                     spotify_popularity: number | null;
//                     created_at: string;
//                 };
//                 Insert: {
//                     id?: string;
//                     artist_id: string;
//                     date: string;
//                     monthly_listeners?: number | null;
//                     youtube_subscribers?: number | null;
//                     youtube_total_views?: number | null;
//                     lastfm_play_count?: number | null;
//                     spotify_followers?: number | null;
//                     spotify_popularity?: number | null;
//                     created_at?: string;
//                 };
//                 Update: {
//                     id?: string;
//                     artist_id?: string;
//                     date?: string;
//                     monthly_listeners?: number | null;
//                     youtube_subscribers?: number | null;
//                     youtube_total_views?: number | null;
//                     lastfm_play_count?: number | null;
//                     spotify_followers?: number | null;
//                     spotify_popularity?: number | null;
//                     created_at?: string;
//                 };
//             };
//             artist_videos: {
//                 Row: {
//                     id: string;
//                     artist_id: string;
//                     youtube_id: string;
//                     title: string;
//                     view_count: number | null;
//                     like_count: number | null;
//                     comment_count: number | null;
//                     published_at: string | null;
//                     updated_at: string;
//                 };
//                 Insert: {
//                     id?: string;
//                     artist_id: string;
//                     youtube_id: string;
//                     title: string;
//                     view_count?: number | null;
//                     like_count?: number | null;
//                     comment_count?: number | null;
//                     published_at?: string | null;
//                     updated_at?: string;
//                 };
//                 Update: {
//                     id?: string;
//                     artist_id?: string;
//                     youtube_id?: string;
//                     title?: string;
//                     view_count?: number | null;
//                     like_count?: number | null;
//                     comment_count?: number | null;
//                     published_at?: string | null;
//                     updated_at?: string;
//                 };
//             };
//             artist_similarities: {
//                 Row: {
//                     id: string;
//                     artist_id: string;
//                     similar_artist_id: string;
//                     similarity_score: number;
//                     platform: string;
//                     updated_at: string;
//                 };
//                 Insert: {
//                     id?: string;
//                     artist_id: string;
//                     similar_artist_id: string;
//                     similarity_score: number;
//                     platform: string;
//                     updated_at?: string;
//                 };
//                 Update: {
//                     id?: string;
//                     artist_id?: string;
//                     similar_artist_id?: string;
//                     similarity_score?: number;
//                     platform?: string;
//                     updated_at?: string;
//                 };
//             };
//         };
//         Functions: {
//             match_artist_comparisons: {
//                 Args: {
//                     query_embedding: number[];
//                     match_threshold: number;
//                     match_count: number;
//                 };
//                 Returns: {
//                     artist1_id: string;
//                     artist2_id: string;
//                     comparison_text: string;
//                     similarity: number;
//                 }[];
//             };
//         };
//     };
// };

export type { SimilarArtist };

export interface LastFmArtistInfo extends Array<SimilarArtist> {}

export interface LastFmResponse {
    similarartists: {
        artist: LastFmArtistInfo;
    };
}


export interface PreviewArtistResponse {
    name: string
    spotifyId: string | null
    lastFmId?: string | null
    youtubeChannelId: string | null
    bio: string | null
    genres: string[]
    imageUrl: string | null
    youtubeUrl?: string | null
    spotifyUrl?: string | null
    tiktokUrl?: string | null
    instagramUrl?: string | null
    similarArtists: SimilarArtist[]
    topTracks?: any[]
    artistVideos?: any[]
    analytics?: {
      lastFmMonthlyListeners?: number
      lastfmPlayCount?: number
      youtubeSubscribers?: number
      youtubeTotalViews?: number
      youtubeVideoCount?: number
      spotifyMonthlyListeners?: number
      spotifyFollowers?: number
      spotifyPopularity?: number
      instagramFollowers?: number
      facebookFollowers?: number
      tiktokFollowers?: number
      soundcloudFollowers?: number
    }
  } 


export interface ArtistIngestionResponse {
    musicbrainzId: string
    lastfmPlayCount: number | null
    lastfmListeners: number | null
    youtubeChannelId: string | undefined
    youtubeChannelStats: any
    biography: string | null
    genres?: string[]
    imageUrl?: string | null
    gender?: string | null
    country?: string | null
    activeYears?: {
        begin: string | null
        end: string | null
    }
}

export interface BasicArtistInfo {
    name: string;
    spotifyId: string | null;
    imageUrl: string | null;
    genres: string[];
}

export interface SpotifyArtist extends BasicArtistInfo {
    followers: number | null;
    popularity: number | null;
}

export interface ArtistInfo extends BasicArtistInfo {
    bio: string | null;
    genres: string[];
    musicbrainzId: string | null;
    country: string | null;
    gender: string | null;
    age: string | null;
    youtubeChannelId: string | null;
    imageUrl: string | null;
    spotifyUrl: string | null;
    youtubeUrl: string | null;
    tiktokUrl: string | null;
    instagramUrl: string | null;
    viberateUrl: string | null;
  }


  
export interface SpotifyTrack {
    name: string;
    trackId: string;
    popularity: number;
    platform: string;
    previewUrl: string | null;
    imageUrl: string | null;
    spotifyStreams: number | null;
    externalUrl: string | null;
  }
  

  export interface ArtistPlatformData {
    musicbrainzId: string;
    lastfmPlayCount: string;
    lastfmListeners: string;
    youtubeChannelId: string;
    youtubeChannelStats: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
    biography: string;
    gender: string;
    country: string;
    begin: string | null;
    end: string | null;
  }

  export interface SpotifyApiTrack {
    id: string
    name: string
    imageUrl: string
    popularity: number
    preview_url: string | null
    external_urls: {
        spotify: string
    }
    album: {
        images: {
            url: string
        }[]
    }
}

export interface SimilarSpotifyArtistWithMatch {
    id: string;
    name: string;
    popularity: number;
    images: {
        url: string;
    }[];
    genres: string[];
    match?: number;
}


export interface YoutubeVideoStatistics {
    viewCount?: string | undefined;
    likeCount?: string | undefined;
    commentCount?: string | undefined;
}

export interface YoutubeChannelInfo {
    id: string;
    statistics: {
        viewCount?: string;
        subscriberCount?: string;
        videoCount?: string;
    };
    topVideos?: YoutubeVideo[];
}

export interface ArtistFormState {
    artistInfo: ArtistInfo;
    analytics: Analytics;
    youtubeVideos: YoutubeVideoInfo[];
    spotifyTracks: SpotifyTrack[];
    similarArtists: SimilarArtist[];
    isSubmitting: boolean;
    errors: Record<string, string>;
  }

