import { ArtistIngestionService } from "@/services/artist-ingestion-service"
import { NextResponse } from "next/server"
import { 
  artistSchema, 
  analyticsSchema, 
  videoSchema, 
  spotifyTrackSchema,
} from "@/validations/artist-schema"
import { z } from "zod"

// Use the existing schemas to create the API request schema
const AddArtistRequestSchema = z.object({
  artistInfo: artistSchema,
  analytics: analyticsSchema,
  videos: z.array(videoSchema),
  tracks: z.array(spotifyTrackSchema),
})

export async function POST(req: Request) {
  try {
    const { artist } = await req.json()
    // console.log('Received artist data:', artist)

    try {
      const validatedArtist = AddArtistRequestSchema.parse(artist)
      console.log('Validation passed:', validatedArtist)
          
    const artistIngestionService = new ArtistIngestionService()
    const result = await artistIngestionService.addArtist(validatedArtist)
    console.log('Result:', result)
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
      console.error('Validation error details:', error.errors)
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
