import { NextResponse } from "next/server";
import {ArtistIngestionService} from "@/services/artist-ingestion-service";
export const GET = async (req: Request) => {
     const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if(!id) {
        return NextResponse.json({error: 'Id is required'}, {status: 400});
    }
    const artistIngestionService = new ArtistIngestionService();
    const videos = await artistIngestionService.getYoutubeVideos(id);
    return NextResponse.json({status: 'success', videos});
}