import { NextResponse } from "next/server"
import { SpotifyService } from "@/services/spotify-service"
import {SpotifyTrackInfo} from "@/validations/artist-schema"

interface SpotifyApiTrack {
  id: string
  name: string
  imageUrl: string
  popularity: number
  preview_url: string | null
  platform: string
  external_urls: {
    spotify: string
  }
  album:{
    images: {
      url: string
    }[]
  }
}



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
    // const tracks = await SpotifyService.getArtistTopTracks(spotifyId)
    // // Transform the tracks data to include only what we need
    // const formattedTracks: SpotifyTrackInfo[] = tracks.map((track: SpotifyApiTrack) => ({
    //   trackId: track.id,
    //   name: track.name,
    //   imageUrl: track.album?.images?.[0]?.url,
    //   popularity: track.popularity,
    //   previewUrl: track.preview_url || null,
    //   externalUrl: track.external_urls?.spotify || null,
    //   spotifyStreams: null,
    //   platform: 'spotify'
    // }))    


    const tracks = await SpotifyService.getTracks(trackIds?.split(',') || [])

    const formattedTracks: Track[] = tracks.map((track:Track) => ({
      trackId: track.id,
      name: track.name,
      popularity: track.popularity,
      platform: 'spotify'
    }))
    console.log('tracks = ', formattedTracks)
    return NextResponse.json({ tracks: formattedTracks })
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 })
  }
} 


