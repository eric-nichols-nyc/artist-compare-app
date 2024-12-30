import { YoutubeVideo } from "@/validations/artist-form-schema";
export interface Database {
    public: {
        Tables: {
            artists: {
                Row: {
                    id: string;
                    name: string;
                    spotify_id: string | null;
                    last_fm_id: string | null;
                    youtube_channel_id: string | null;
                    bio: string | null;
                    genres: string[] | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    spotify_id?: string | null;
                    last_fm_id?: string | null;
                    youtube_channel_id?: string | null;
                    bio?: string | null;
                    genres?: string[] | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    spotify_id?: string | null;
                    last_fm_id?: string | null;
                    youtube_channel_id?: string | null;
                    bio?: string | null;
                    genres?: string[] | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            artist_comparisons: {
                Row: {
                    id: string;
                    artist1_id: string;
                    artist2_id: string;
                    comparison_text: string;
                    similarity_score: number | null;
                    embedding: number[];
                    source: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    artist1_id: string;
                    artist2_id: string;
                    comparison_text: string;
                    similarity_score?: number | null;
                    embedding: number[];
                    source: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    artist1_id?: string;
                    artist2_id?: string;
                    comparison_text?: string;
                    similarity_score?: number | null;
                    embedding?: number[];
                    source?: string;
                    created_at?: string;
                };
            };
            artist_analytics: {
                Row: {
                    id: string;
                    artist_id: string;
                    date: string;
                    monthly_listeners: number | null;
                    youtube_subscribers: number | null;
                    youtube_total_views: number | null;
                    lastfm_play_count: number | null;
                    spotify_followers: number | null;
                    spotify_popularity: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    artist_id: string;
                    date: string;
                    monthly_listeners?: number | null;
                    youtube_subscribers?: number | null;
                    youtube_total_views?: number | null;
                    lastfm_play_count?: number | null;
                    spotify_followers?: number | null;
                    spotify_popularity?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    artist_id?: string;
                    date?: string;
                    monthly_listeners?: number | null;
                    youtube_subscribers?: number | null;
                    youtube_total_views?: number | null;
                    lastfm_play_count?: number | null;
                    spotify_followers?: number | null;
                    spotify_popularity?: number | null;
                    created_at?: string;
                };
            };
            artist_videos: {
                Row: {
                    id: string;
                    artist_id: string;
                    youtube_id: string;
                    title: string;
                    view_count: number | null;
                    like_count: number | null;
                    comment_count: number | null;
                    published_at: string | null;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    artist_id: string;
                    youtube_id: string;
                    title: string;
                    view_count?: number | null;
                    like_count?: number | null;
                    comment_count?: number | null;
                    published_at?: string | null;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    artist_id?: string;
                    youtube_id?: string;
                    title?: string;
                    view_count?: number | null;
                    like_count?: number | null;
                    comment_count?: number | null;
                    published_at?: string | null;
                    updated_at?: string;
                };
            };
            artist_similarities: {
                Row: {
                    id: string;
                    artist_id: string;
                    similar_artist_id: string;
                    similarity_score: number;
                    platform: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    artist_id: string;
                    similar_artist_id: string;
                    similarity_score: number;
                    platform: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    artist_id?: string;
                    similar_artist_id?: string;
                    similarity_score?: number;
                    platform?: string;
                    updated_at?: string;
                };
            };
        };
        Functions: {
            match_artist_comparisons: {
                Args: {
                    query_embedding: number[];
                    match_threshold: number;
                    match_count: number;
                };
                Returns: {
                    artist1_id: string;
                    artist2_id: string;
                    comparison_text: string;
                    similarity: number;
                }[];
            };
        };
    };
};

export interface SimilarArtist {
    name: string;
    match: string;
}

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
    spotifyId: string | null | undefined;
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
    activeYears: {
        begin: string | null;
        end: string | null;
    };
    youtubeChannelId: string | null;
    imageUrl: string | null;
    spotifyUrl: string | null;
    youtubeUrl: string | null;
    tiktokUrl: string | null;
    instagramUrl: string | null;
    viberateUrl: string | null;
  }
  

export interface Analytics {
    spotifyMonthlyListeners: number | null;
    youtubeSubscribers: number | null;
    youtubeTotalViews: number | null;
    lastfmListeners: number | null;
    lastfmPlayCount: number | null;
    spotifyFollowers: number | null;
    spotifyPopularity: number | null;
    instagramFollowers: number | null;
    facebookFollowers: number | null;
    tiktokFollowers: number | null;
    soundcloudFollowers: number | null;
  }

  
export interface SpotifyTrack {
    name: string;
    trackId: string;
    popularity: number;
    previewUrl: string | null;
    albumImageUrl: string | null;
    spotifyStreams: number | null;
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

  export interface SpotifyTrack {
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
    youtubeVideos: YoutubeVideo[];
    spotifyTracks: SpotifyTrack[];
    similarArtists: SimilarArtist[];
    isSubmitting: boolean;
    errors: Record<string, string>;
  }

export type FormAction =
  | { type: 'UPDATE_ARTIST_INFO'; payload: Partial<ArtistInfo> }
  | { type: 'SELECT_ARTIST'; payload: SpotifyArtist }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<Analytics> }
  | { type: 'UPDATE_YOUTUBE_VIDEOS'; payload: YoutubeVideo[] }
  | { type: 'UPDATE_SPOTIFY_TRACKS'; payload: SpotifyTrack[] }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'UPDATE_SIMILAR_ARTIST_SELECTION'; payload: SimilarArtist[] }
  | { type: 'RESET_FORM' }
  | { type: 'CANCEL_ARTIST_SELECTION' };
