import { NextResponse } from "next/server"
import { ArtistIngestionService } from "@/services/artist-ingestion-service"

const artistIngestionService = new ArtistIngestionService()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  try {
    const artistInfo = await artistIngestionService.getArtistInfo(name)
    
    return NextResponse.json({
      lastfmListeners: artistInfo.lastfmListeners,
      lastfmPlayCount: artistInfo.lastfmPlayCount,
      youtubeSubscribers: artistInfo.youtubeChannelStats?.subscriberCount,
      youtubeViews: artistInfo.youtubeChannelStats?.viewCount,
      spotifyFollowers: artistInfo.spotifyFollowers,
      spotifyPopularity: artistInfo.spotifyPopularity
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
} 