import { NextResponse } from "next/server"
import { SpotifyService } from "@/services/spotify-service"
import { ArtistIngestionService } from "@/services/artist-ingestion-service"

const artistIngestionService = new ArtistIngestionService()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  try {
    // Get similar artists from Spotify
    
    // Get the artist's name to fetch Last.fm similar artists
    const lastFmSimilar = await artistIngestionService.getLastFmSimilarArtistInfo(name)
    
    // return the similar artists
    return NextResponse.json({ artists: lastFmSimilar })
  } catch (error) {
    console.error('Error fetching similar artists:', error)
    return NextResponse.json({ error: 'Failed to fetch similar artists' }, { status: 500 })
  }
} 