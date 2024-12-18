// app/api/artists/relationships/route.ts
import { ArtistRelationshipsService } from '@/services/artist-relationships-service';
import { NextResponse } from 'next/server';

const relationshipsService = new ArtistRelationshipsService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const artist1 = searchParams.get('artist1');
  const artist2 = searchParams.get('artist2');

  if (!artist1 || !artist2) {
    return NextResponse.json(
      { error: 'Both artist names are required' },
      { status: 400 }
    );
  }

  try {
    const relationships = await relationshipsService.compareArtistRelationships(
      artist1,
      artist2
    );

    return NextResponse.json(relationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist relationships' },
      { status: 500 }
    );
  }
}

// send error method not allowed if the request method is not GET
export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
