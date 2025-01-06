export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          name: string
          created_at: string
          // Add other columns as needed
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      social_stats: {
        Row: {
          id: string
          artist_id: string
          spotify_followers: number
          youtube_subscribers: number
          instagram_followers: number
          facebook_followers: number
          tiktok_followers: number
          soundcloud_followers: number
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          spotify_followers?: number
          youtube_subscribers?: number
          instagram_followers?: number
          facebook_followers?: number
          tiktok_followers?: number
          soundcloud_followers?: number
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          spotify_followers?: number
          youtube_subscribers?: number
          instagram_followers?: number
          facebook_followers?: number
          tiktok_followers?: number
          soundcloud_followers?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 