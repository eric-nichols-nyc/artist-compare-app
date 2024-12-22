import { NextResponse } from "next/server";
import { ArtistIngestionService } from "@/services/artist-ingestion-service";
import { ArtistIngestionResponse } from "@/types/api";
import { GeminiService } from "@/services/gemini-service";
const artistIngestionService = new ArtistIngestionService();
export async function GET(req: Request) {
    console.log('========== getArtistIds','====================');
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    console.log('========== name', name,'====================');

    if(!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const artist: ArtistIngestionResponse = await artistIngestionService.getArtistInfo(name);
    // if artist biographySummary is null, generate it
    if(!artist.biography) {
        const geminiService = new GeminiService();
        const summaryBio = await geminiService.generateArtistBio({
            name,
            genres: artist.genres,
            country: artist.country,
            gender: artist.gender,
            activeYears: artist.activeYears
        }, 'summary');
        artist.biography = summaryBio;
    }
    console.log(artist);
    return NextResponse.json(artist);
}