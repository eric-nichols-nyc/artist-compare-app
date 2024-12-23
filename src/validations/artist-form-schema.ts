import { z } from "zod";

// Helper schemas for common patterns
const urlSchema = z.string().url().nullable().or(z.literal(""));
const positiveNumberSchema = z.number().min(0).nullable();
const socialMediaSchema = z.object({
  followers: z.number().min(0),
  url: urlSchema,
});

// Artist Info Section
export const artistInfoSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  bio: z.string().nullable(),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  spotifyId: z.string().nullable(),
  lastFmId: z.string().nullable(),
  youtubeChannelId: z.string().nullable(),
  imageUrl: urlSchema,
  spotifyUrl: urlSchema,
  youtubeUrl: urlSchema,
  tiktokUrl: urlSchema,
  instagramUrl: urlSchema,
}).refine((data) => {
  // At least one platform ID must be provided
  return data.spotifyId || data.lastFmId || data.youtubeChannelId;
}, {
  message: "At least one platform ID (Spotify, Last.fm, or YouTube) is required",
  path: ["platformId"],
});

// Analytics Section
export const analyticsSchema = z.object({
  monthlyListeners: positiveNumberSchema,
  youtubeSubscribers: positiveNumberSchema,
  youtubeTotalViews: positiveNumberSchema,
  lastfmPlayCount: positiveNumberSchema,
  spotifyFollowers: positiveNumberSchema,
  spotifyPopularity: z.number().min(0).max(100).nullable(),
  instagramFollowers: positiveNumberSchema,
  facebookFollowers: positiveNumberSchema,
  tiktokFollowers: positiveNumberSchema,
  soundcloudFollowers: positiveNumberSchema,
});

// YouTube Video Schema
export const youtubeVideoSchema = z.object({
  title: z.string().min(1, "Video title is required"),
  videoId: z.string().min(1, "Video ID is required"),
  viewCount: z.number().min(0, "View count must be positive"),
  likeCount: z.number().min(0, "Like count must be positive"),
  commentCount: z.number().min(0, "Comment count must be positive"),
  thumbnail: urlSchema,
  publishedAt: z.string().datetime(),
});

// Spotify Track Schema
export const spotifyTrackSchema = z.object({
  name: z.string().min(1, "Track name is required"),
  trackId: z.string().min(1, "Track ID is required"),
  popularity: z.number().min(0).max(100),
  previewUrl: urlSchema,
  albumImageUrl: urlSchema,
  spotifyStreams: positiveNumberSchema,
});

// Complete Form Schema
export const artistFormSchema = z.object({
  artistInfo: artistInfoSchema,
  analytics: analyticsSchema,
  youtubeVideos: z.array(youtubeVideoSchema),
  spotifyTracks: z.array(spotifyTrackSchema),
});

// Infer types from schemas
export type ArtistFormData = z.infer<typeof artistFormSchema>;
export type ArtistInfo = z.infer<typeof artistInfoSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type YoutubeVideo = z.infer<typeof youtubeVideoSchema>;
export type SpotifyTrack = z.infer<typeof spotifyTrackSchema>;

// Validation function
export async function validateArtistForm(data: unknown) {
  try {
    await artistFormSchema.parseAsync(data);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, curr) => {
        const path = curr.path.join('.');
        acc[path] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return { success: false, errors };
    }
    throw error;
  }
}

// Transform functions for API data
export const transformApiResponse = {
  artistInfo: (data: any): ArtistInfo => {
    return artistInfoSchema.parse({
      name: data.name,
      bio: data.bio || null,
      genres: Array.isArray(data.genres) ? data.genres : [],
      spotifyId: data.spotify_id || null,
      lastFmId: data.last_fm_id || null,
      youtubeChannelId: data.youtube_channel_id || null,
      imageUrl: data.image_url || null,
      spotifyUrl: data.spotify_url || null,
      youtubeUrl: data.youtube_url || null,
      tiktokUrl: data.tiktok_url || null,
      instagramUrl: data.instagram_url || null,
    });
  },

  analytics: (data: any): Analytics => {
    return analyticsSchema.parse({
      monthlyListeners: data.monthly_listeners || null,
      youtubeSubscribers: data.youtube_subscribers || null,
      youtubeTotalViews: data.youtube_total_views || null,
      lastfmPlayCount: data.lastfm_play_count || null,
      spotifyFollowers: data.spotify_followers || null,
      spotifyPopularity: data.spotify_popularity || null,
      instagramFollowers: data.instagram_followers || null,
      facebookFollowers: data.facebook_followers || null,
      tiktokFollowers: data.tiktok_followers || null,
      soundcloudFollowers: data.soundcloud_followers || null,
    });
  },

  youtubeVideo: (data: any): YoutubeVideo => {
    return youtubeVideoSchema.parse({
      title: data.title,
      videoId: data.video_id,
      viewCount: parseInt(data.view_count),
      likeCount: parseInt(data.like_count),
      commentCount: parseInt(data.comment_count),
      thumbnail: data.thumbnail || null,
      publishedAt: data.published_at,
    });
  },

  spotifyTrack: (data: any): SpotifyTrack => {
    return spotifyTrackSchema.parse({
      name: data.name,
      trackId: data.track_id,
      popularity: data.popularity,
      previewUrl: data.preview_url || null,
      albumImageUrl: data.album_image_url || null,
      spotifyStreams: data.spotify_streams || null,
    });
  },
};