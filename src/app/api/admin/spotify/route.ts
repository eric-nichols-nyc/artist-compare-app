

// get artist info from spotify service
import { SpotifyService } from "@/services/spotify-service";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    if(!name) {
        return NextResponse.json({error: 'Name is required'}, {status: 400});
    }
    const artist = await SpotifyService.searchArtist(name);
    return NextResponse.json(artist);
}