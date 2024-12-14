// app/api/artists/[id]/route.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../types';
import { NextResponse } from 'next/server';

const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json(
            { error: 'Invalid artist name' },
            { status: 400 }
        );
    }

    try {
        // First get the artist ID
        const { data: artist, error: artistError } = await supabase
            .from('artists')
            .select('id')
            .eq('name', decodeURIComponent(id))
            .single();

        if (artistError) {
            if (artistError.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Artist not found' },
                    { status: 404 }
                );
            }
            throw artistError;
        }

        // Then get similar artists
        const { data: similarArtists, error: similarError } = await supabase
            .from('artist_similarities')
            .select(`
                similarity_score,
                similar_artist_id,
                similar_artist:artists!artist_similarities_similar_artist_id_fkey (
                    name
                )
            `)
            .eq('artist_id', artist.id)
            .order('similarity_score', { ascending: false })
            .limit(5);

        if (similarError) {
            throw similarError;
        }

        // Add console.log to debug the response
        console.log('Raw similarArtists response:', JSON.stringify(similarArtists, null, 2));

        // Format the response with null check
        const formattedSimilarArtists = similarArtists
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((item: any) => {
                console.log('Processing item:', JSON.stringify(item, null, 2));
                // Check if item and similar_artist exists and is not empty array or null
                return item && 
                item.similar_artist && item.similar_artist  && item.similar_artist.name
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => ({
                artist: item.similar_artist.name,
                similarity: item.similarity_score
            }));

        return NextResponse.json({
            selectedArtist: decodeURIComponent(id),
            similarArtists: formattedSimilarArtists
        });

    } catch (error) {
        console.error('Error fetching similar artists:', error);
        return NextResponse.json(
            { error: 'Failed to fetch similar artists' },
            { status: 500 }
        );
    }
}