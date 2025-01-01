import { NextResponse } from "next/server";
import { ArtistIngestionService } from "@/services/artist-ingestion-service";
import { ArtistIngestionResponse } from "@/types";
import { GeminiService } from "@/services/gemini-service";
const artistIngestionService = new ArtistIngestionService();
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if(!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const artist: ArtistIngestionResponse = await artistIngestionService.getArtistInfo(name);
    // function to format the artists age from the active years
    function formatAge(activeYears: { begin: string | null; end: string | null }): number | null {
        if (!activeYears.begin) return null;
        
        const beginDate = new Date(activeYears.begin);
        const endDate = activeYears.end ? new Date(activeYears.end) : new Date();
        
        return Math.floor((endDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    }

    artist.age = artist.activeYears ? formatAge(artist.activeYears) : null
    artist.youtubeChannelStats.viewCount = parseFormattedNumber(artist.youtubeChannelStats.viewCount)
    artist.youtubeChannelStats.subscriberCount = parseFormattedNumber(artist.youtubeChannelStats.subscriberCount)
    // if artist biographySummary is null, generate it

    if(!artist.biography) {
        const geminiService = new GeminiService();
        const summaryBio = await geminiService.generateArtistBio({
            name,
            country: artist.country,
            gender: artist.gender,
            activeYears: artist.activeYears
        }, 'summary');
        artist.biography = summaryBio;
    }

    return NextResponse.json(artist);
}

function parseFormattedNumber(str: string | null | undefined): number {
  if (!str) return 0;
  return parseInt(str.replace(/,/g, ''));
}