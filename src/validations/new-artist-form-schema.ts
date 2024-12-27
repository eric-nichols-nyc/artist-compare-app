import { z } from "zod";

// Helper schemas for common patterns
const urlSchema = z
  .string()
  .url("Must be a valid URL")
  .nullable()
  .or(z.literal(""));

const positiveNumberSchema = z
  .number()
  .min(0, "Must be a positive number")
  .nullable()
  .or(z.literal(""));

// Platform IDs validation
const platformIdsSchema = z.object({
  spotifyId: z.string().nullable(),
  lastFmId: z.string().nullable(),
  youtubeChannelId: z.string().nullable(),
}).refine(
  (data) => data.spotifyId || data.lastFmId || data.youtubeChannelId,
  "At least one platform ID is required"
);

// Artist basic information
const artistBasicSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().nullable(),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  imageUrl: urlSchema,
});

// Social media URLs
const socialMediaSchema = z.object({
  spotifyUrl: urlSchema,
  youtubeUrl: urlSchema,
  tiktokUrl: urlSchema,
  instagramUrl: urlSchema,
});

// Analytics data
const analyticsSchema = z.object({
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

// YouTube video
const youtubeVideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  videoId: z.string().min(1, "Video ID is required"),
  viewCount: z.number().min(0, "View count must be positive"),
  likeCount: z.number().min(0, "Like count must be positive"),
  commentCount: z.number().min(0, "Comment count must be positive"),
  thumbnail: urlSchema,
  publishedAt: z.string().datetime("Must be a valid date"),
});

// Spotify track
const spotifyTrackSchema = z.object({
  name: z.string().min(1, "Track name is required"),
  trackId: z.string().min(1, "Track ID is required"),
  popularity: z.number().min(0).max(100, "Popularity must be between 0 and 100"),
  previewUrl: urlSchema,
  albumImageUrl: urlSchema,
  spotifyStreams: positiveNumberSchema,
});

// Similar artist
const similarArtistSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  match: z.number().min(0).max(1, "Match score must be between 0 and 1"),
});

// Complete artist form schema
export const artistFormSchema = z.object({
  // Combine platform IDs and basic info
  artistInfo: artistBasicSchema.merge(platformIdsSchema).merge(socialMediaSchema),
  
  // Analytics
  analytics: analyticsSchema,
  
  // Media content
  youtubeVideos: z.array(youtubeVideoSchema)
    .max(50, "Maximum of 50 videos allowed"),
  
  spotifyTracks: z.array(spotifyTrackSchema)
    .max(50, "Maximum of 50 tracks allowed"),
    
  similarArtists: z.array(similarArtistSchema)
    .min(1, "At least one similar artist is required")
    .max(20, "Maximum of 20 similar artists allowed"),
});

// Form data type
export type ArtistFormData = z.infer<typeof artistFormSchema>;

// Validation helper function
export async function validateArtistForm(data: unknown) {
  try {
    const validatedData = await artistFormSchema.parseAsync(data);
    return {
      success: true as const,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, curr) => {
        const path = curr.path.join('.');
        acc[path] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return {
        success: false as const,
        errors,
      };
    }
    
    throw error;
  }
}

// Progressive validation helpers
export const validateArtistInfo = async (data: unknown) => {
  const schema = artistBasicSchema.merge(platformIdsSchema).merge(socialMediaSchema);
  return schema.safeParseAsync(data);
};

export const validateAnalytics = async (data: unknown) => {
  return analyticsSchema.safeParseAsync(data);
};

export const validateMedia = async (data: unknown) => {
  const mediaSchema = z.object({
    youtubeVideos: z.array(youtubeVideoSchema),
    spotifyTracks: z.array(spotifyTrackSchema),
  });
  return mediaSchema.safeParseAsync(data);
};

export const validateSimilarArtists = async (data: unknown) => {
  return z.array(similarArtistSchema).safeParseAsync(data);
};