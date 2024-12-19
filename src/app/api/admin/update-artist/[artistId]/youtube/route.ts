import { ArtistIngestionService } from "@/services/artist-ingestion-service"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { artistId: string } }
) {
  try {
    const artistId = params.artistId
    const { youtubeChannelId } = await req.json()
    
    const ingestionService = new ArtistIngestionService()
    const updatedArtist = await ingestionService.getYoutubeChannelInfo(artistId, youtubeChannelId)

    return NextResponse.json(updatedArtist)
  } catch (error) {
    console.error("Error updating YouTube data:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 