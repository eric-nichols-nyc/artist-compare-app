import * as z from "zod"

export const artistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  spotifyId: z.string().nullable().optional(),
  lastFmId: z.string().nullable().optional(),
  youtubeChannelId: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  genres: z.array(z.string()).default([]),
  imageUrl: z.string().url().nullable().optional(),
  youtubeUrl: z.string().url().nullable().optional(),
  spotifyUrl: z.string().url().nullable().optional(),
  tiktokUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
})

export type ArtistFormValues = z.infer<typeof artistSchema> 