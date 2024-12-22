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
    // First get the channel ID from artist info
    const artistInfo = await artistIngestionService.getArtistInfo(name)
    
    if (!artistInfo.youtubeChannelId) {
      return NextResponse.json({ videos: [] })
    }

    // Then get the videos using the channel ID
    const videos = await artistIngestionService.getYoutubeVideos(artistInfo.youtubeChannelId)
    
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
} 