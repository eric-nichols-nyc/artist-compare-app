import { ArtistIngestionService } from "@/services/artist-ingestion-service"
import { PreviewArtistResponse } from "@/types/api"
import { NextResponse } from "next/server"
import { z } from "zod"

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
})


export async function POST(req: Request) {
  const { artist } = await req.json()
  // add zod validation for ArtistFormValues
  const validatedArtist = ArtistFormValuesSchema.parse(artist)
  // send back flattened errors if any
  if (validatedArtist.error) {
    return new NextResponse(validatedArtist.error, { status: 400 })
  }

  // add artist to database
  const artistIngestionService = new ArtistIngestionService()
  const result = await artistIngestionService.addArtist(validatedArtist)
  return new NextResponse(result, { status: 200 })

}
