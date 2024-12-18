// app/api/compare/route.ts
import { MusicBrainzService } from '@/services/music-brainz-service';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI();
const musicBrainz = new MusicBrainzService();

export async function POST(request: Request) {
  try {
    const { artist1, artist2 } = await request.json();

    if (!artist1 || !artist2) {
      return NextResponse.json(
        { error: 'Both artists are required' },
        { status: 400 }
      );
    }

    // Get factual data from MusicBrainz
    const [artist1Data, artist2Data] = await Promise.all([
      musicBrainz.getArtistDetails(artist1),
      musicBrainz.getArtistDetails(artist2)
    ]);
    console.log('artist1Data ', artist1Data);
    console.log('artist2Data ', artist2Data);

    // Get common collaborators if both artists were found
    let commonCollaborators: string[] = [];
    if (artist1Data && artist2Data) {
      commonCollaborators = await musicBrainz.getCommonCollaborators(
        artist1Data.id,
        artist2Data.id
      );
    }

    // Create enhanced prompt with factual data
    
   


    // // Generate comparison using OpenAI
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{
    //     role: "user",
    //     content: enhancedPrompt
    //   }]

    return NextResponse.json({ 
      metadata: {
        artist1: artist1Data,
        artist2: artist2Data,
      }
    });

  } catch (error) {
    console.error('Error in comparison:', error);
    return NextResponse.json(
      { error: 'Failed to generate comparison' },
      { status: 500 }
    );
  }
}