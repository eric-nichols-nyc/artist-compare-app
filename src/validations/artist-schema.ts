import z from "zod";
import { Prisma } from "@prisma/client"

export const artistSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  spotifyId: z.string().nullable(),
  musicbrainzId: z.string().nullable(),
  youtubeChannelId: z.string().nullable(),
  bio: z.string().nullable(),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  gender: z.string().nullable(),
  country: z.string().nullable(),
  age: z.string().nullable(),
  imageUrl: z.string().nullable(),
  youtubeUrl: z.string().nullable(),
  spotifyUrl: z.string().nullable(),
  tiktokUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
}) satisfies z.Schema<Prisma.ArtistCreateInput>;
