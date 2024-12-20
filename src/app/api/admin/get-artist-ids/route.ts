import { NextResponse } from "next/server";
import { ArtistIngestionService } from "@/services/artist-ingestion-service";

const artistIngestionService = new ArtistIngestionService();
export async function GET(req: Request) {
    console.log('========== getArtistIds','====================');
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    console.log('========== name', name,'====================');

    if(!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const artist = await artistIngestionService.getArtistInfo(name);
    console.log('========== artistIds====================');
    console.log(artist);
    return NextResponse.json(artist);
}