// app/api/artists/route.ts
import { db } from "@/lib/db"
import { artistSchema } from "@/lib/validations/artist"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = artistSchema.parse(json)

    const artist = await db.artist.create({
      data: {
        name: body.name,
        spotifyId: body.spotifyId,
        lastFmId: body.lastFmId,
        youtubeChannelId: body.youtubeChannelId,
        bio: body.bio,
        genres: body.genres,
        imageUrl: body.imageUrl,
        youtubeUrl: body.youtubeUrl,
        spotifyUrl: body.spotifyUrl,
        tiktokUrl: body.tiktokUrl,
        instagramUrl: body.instagramUrl,
      },
    })

    return NextResponse.json(artist)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}