import { ArtistIngestionService } from "@/services/artist-ingestion-service"
import { NextResponse } from "next/server"

export async function PUT(
  req: Request,
  { params }: { params: { artistId: string } }
) {
  try {
    const artistId = params.artistId
    const data = await req.json()
    
    const ingestionService = new ArtistIngestionService()
    const updatedArtist = await ingestionService.updateArtist(artistId, data)

    return NextResponse.json(updatedArtist)
  } catch (error) {
    console.error("Error updating artist:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 