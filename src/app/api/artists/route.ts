// app/api/artists/route.ts
import { artistSchema } from "@/lib/validations/artist"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = artistSchema.parse(json)


    return NextResponse.json(body)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}