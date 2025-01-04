import { NextResponse } from "next/server"
import { SpotifyService } from "@/services/spotify-service"

interface Track {
  id: string
  name: string
  popularity: number
  platform: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const spotifyId = searchParams.get('spotifyId')
  const trackIds = searchParams.get('spotifyIds')

  if (!spotifyId) {
    return NextResponse.json({ error: 'Spotify ID is required' }, { status: 400 })
  }

  try {
    const tracks = await SpotifyService.getTracks(trackIds?.split(',') || [])

    const formattedTracks: Track[] = tracks.map((track:Track) => ({
      trackId: track.id,
      name: track.name,
      popularity: track.popularity,
      platform: 'spotify'
    }))
    return NextResponse.json({ tracks: formattedTracks })
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 })
  }
} 


