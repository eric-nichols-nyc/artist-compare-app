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
    artist.youtubeChannelStats.viewCount = parseInt(artist.youtubeChannelStats.viewCount)
    artist.youtubeChannelStats.subscriberCount = parseInt(artist.youtubeChannelStats.subscriberCount)
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

    console.log('artist =========== ', artist)

    return NextResponse.json(artist);
}

function parseFormattedNumber(str: string | null | undefined): number {
  if (!str) return 0;
  return parseInt(str.replace(/,/g, ''));
}