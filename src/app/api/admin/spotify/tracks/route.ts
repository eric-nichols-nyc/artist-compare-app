import { NextResponse } from "next/server";
import { SpotifyService } from "@/services/spotify-service";
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if(!id) {
        return NextResponse.json({error: 'Id is required'}, {status: 400});
    }
    const spotifyService = new SpotifyService();
    const tracks = await spotifyService.getTopTracks(id);
    return NextResponse.json({status: 'success', tracks});
}