// app/api/compare/route.ts
import { OpenAIService } from '../../../services/openai-service';
import { NextResponse } from 'next/server';

const openAIService = new OpenAIService();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { artist1, artist2 } = body;

        if (!artist1 || !artist2) {
            return NextResponse.json(
                { error: 'Both artists are required' },
                { status: 400 }
            );
        }

        // Get artist IDs
        const { data: artists, error: artistError } = await openAIService.supabase
            .from('artists')
            .select('id, name')
            .in('name', [artist1, artist2]);

        if (artistError) {
            console.error('Error fetching artists:', artistError);
            throw artistError;
        }

        // Find the artist IDs
        const artist1Data = artists?.find(a => a.name === artist1);
        const artist2Data = artists?.find(a => a.name === artist2);

        if (!artist1Data || !artist2Data) {
            return NextResponse.json(
                { error: 'One or both artists not found in database' },
                { status: 404 }
            );
        }

        // Get or generate the comparison
        const { comparisonText, source } = await openAIService.getOrGenerateComparison(
            artist1Data.id,
            artist2Data.id,
            artist1,
            artist2
        );

        return NextResponse.json({
            comparison: comparisonText,
            source: source
        });

    } catch (error) {
        console.error('Error in comparison endpoint:', error);
        return NextResponse.json(
            { error: 'Failed to generate comparison' },
            { status: 500 }
        );
    }
}