import { NextResponse } from "next/server";
import { YoutubeService } from "@/services/youtube-service";
export const GET = async (req: Request) => {
     const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if(!id) {
        return NextResponse.json({error: 'Id is required'}, {status: 400});
    }
    const youtubeService = new YoutubeService();
    const videos = await youtubeService.getChannelTopVideos(id);
    return NextResponse.json({status: 'success', videos});
}