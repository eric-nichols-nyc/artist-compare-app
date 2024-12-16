import { NextResponse } from 'next/server';
import { AddArtistService } from '@/services/add-artist-service';
import { ArtistIngestionService } from '@/services/artist-ingestion-service';

export async function POST(request: Request) {
  try{
    const { artistName } = await request.json();
    const addArtistService = new ArtistIngestionService();
    const artistData = await addArtistService.ingestArtist(artistName);
    return NextResponse.json(artistData);
  } catch (error) {
    console.error('Error adding artist:', error);
    return NextResponse.json({ error: 'Failed to add artist' }, { status: 500 });
  }
}