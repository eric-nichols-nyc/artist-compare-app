import { NextResponse } from 'next/server';
import { SpotifyService } from '@/services/spotify-service';

export async function POST(request: Request) {
    try {
        const { artistName } = await request.json();
        
        if (!artistName) {
            return NextResponse.json(
                { error: 'Artist name is required' },
                { status: 400 }
            );
        }

        const artistData = await SpotifyService.searchArtist(artistName);
        
        return NextResponse.json({
            id: artistData.id,
            name: artistData.name,
            images: artistData.images,
            genres: artistData.genres,
            popularity: artistData.popularity,
            followers: artistData.followers
        });
    } catch (error) {
        console.error('Error searching artist:', error);
        return NextResponse.json(
            { error: 'Failed to search artist' },
            { status: 500 }
        );
    }
} 