import { NextResponse } from "next/server"
import { YoutubeService } from "@/services/youtube-service"

const youtubeService = new YoutubeService()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get('channelId')

  if (!channelId) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  try {

    // Then get the videos using the channel ID
    const videos = await youtubeService.getTopPlaylistVideos('OLAK5uy_kOjcMYd-zFhGK7iPzOb1m2-3ituAZSNe0')
    console.log('videos ', videos)
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
} 