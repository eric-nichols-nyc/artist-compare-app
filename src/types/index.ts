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