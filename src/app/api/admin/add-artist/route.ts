import { ArtistIngestionService } from "@/services/artist-ingestion-service"
import { NextResponse } from "next/server"
import { 
  artistSchema, 
  analyticsSchema, 
  videoSchema, 
  spotifyTrackSchema,
} from "@/validations/artist-schema"
import { z } from "zod"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const AddArtistRequestSchema = z.object({
  artistInfo: artistSchema.extend({
    birthDate: z.date().nullable(),
    birthPlace: z.string().nullable(),
    youtubeChartsUrl: z.string().nullable(),
  }),
  analytics: analyticsSchema,
  videos: z.array(videoSchema),
  tracks: z.array(spotifyTrackSchema),
})

export async function POST(req: Request) {

  try {
    const { artist } = await req.json()

    try {
      const validatedArtist = AddArtistRequestSchema.parse({
        ...artist,
        artistInfo: {
          ...artist.artistInfo,
          birthDate: artist.artistInfo.birthDate ? new Date(artist.artistInfo.birthDate) : null,
        }
      })
      
      const artistIngestionService = new ArtistIngestionService()
      const result = await artistIngestionService.addArtist(validatedArtist)
      return NextResponse.json(result, { status: 200 })

    } catch (e) {
      if (e instanceof z.ZodError) {
        console.log('Validation failed:', e.errors)
        throw e
      }
      throw e
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        errors: error.flatten().fieldErrors,
        message: 'Validation failed'
      }, { status: 400 })
    }
    console.error('Error adding artist:', error)
    return NextResponse.json({ 
      message: 'Something went wrong' 
    }, { status: 500 })
  }
}
