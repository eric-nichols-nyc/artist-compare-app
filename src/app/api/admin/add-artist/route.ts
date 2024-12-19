import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get("name")

    if (!name) {
      return new NextResponse("Artist name is required", { status: 400 })
    }

    // Here you would implement the logic to fetch artist details from various sources
    // This is a placeholder response
    const artistData = {
      spotifyId: "",
      lastFmId: "",
      youtubeChannelId: "",
      bio: "",
      genres: [],
      imageUrl: "",
      youtubeUrl: "",
      spotifyUrl: "",
      tiktokUrl: "",
      instagramUrl: "",
      // Add any additional data you fetch
    }

    return NextResponse.json(artistData)
  } catch (error) {
    console.error("Error fetching artist details:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 