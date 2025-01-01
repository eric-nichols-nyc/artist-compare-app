import { ArtistIngestionService } from "@/services/artist-ingestion-service"
import { NextResponse } from "next/server"
import { z } from "zod"

const AnalyticsSchema = z.object({
  spotifyFollowers: z.number().optional(),
  spotifyPopularity: z.number().optional(),
  youtubeSubscribers: z.number().optional(),
  youtubeTotalViews: z.number().optional(),
  lastfmPlayCount: z.number().optional(),
  monthlyListeners: z.number().optional(),
}).nullable()

const ArtistFormValuesSchema = z.object({
  name: z.string().min(1),
  spotifyId: z.string().optional(),
  lastFmId: z.string().optional(),
  youtubeChannelId: z.string().optional(),
  bio: z.string().optional(),
  genres: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  spotifyUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  analytics: AnalyticsSchema,
  artistVideos: z.array(z.object({
    youtubeId: z.string(),
    title: z.string(),
    viewCount: z.number(),
    likeCount: z.number(),
    commentCount: z.number(),
    publishedAt: z.string()
  })).optional()
})

export async function POST(req: Request) {
  const { artist } = await req.json()
  try {
    const validatedArtist = ArtistFormValuesSchema.parse(artist)
    const artistIngestionService = new ArtistIngestionService()
    const result = await artistIngestionService.addArtist(validatedArtist)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten().fieldErrors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
