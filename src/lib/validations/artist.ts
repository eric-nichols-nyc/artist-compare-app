import * as z from "zod"

export const artistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  spotifyId: z.string().min(1, "Spotify ID is required"),
  lastFmId: z.string().nullable().optional(),
  youtubeChannelId: z.string().min(1, "YouTube Channel ID is required"),
  bio: z.string().nullable().optional(),
  genres: z.array(z.string()).default([]),
  imageUrl: z.string().url().nullable().optional(),
  youtubeUrl: z.string().url().nullable().optional(),
  spotifyUrl: z.string().url().nullable().optional(),
  tiktokUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  similarArtists: z.array(
    z.object({
      name: z.string(),
      match: z.string()
    })
  ).optional(),
  topTracks: z.array(
    z.object({
      name: z.string(),
      popularity: z.number(),
      previewUrl: z.string().optional()
    })
  ).optional(),
  artistVideos: z.array(
    z.object({
      title: z.string(),
      viewCount: z.number(),
      url: z.string().optional()
    })
  ).optional(),
  analytics: z.object({
    monthlyListeners: z.number().optional(),
    youtubeSubscribers: z.number().optional(),
    youtubeTotalViews: z.number().optional(),
    lastfmPlayCount: z.number().optional(),
    spotifyFollowers: z.number().optional(),
    spotifyPopularity: z.number().optional(),
    // ... other analytics fields
  }).nullable(),
})

export type ArtistFormValues = z.infer<typeof artistSchema> 