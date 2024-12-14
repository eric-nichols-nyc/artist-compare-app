// app/api/artists/[id]/metrics/route.ts

import { getArtistMetrics } from '@/services/artist-metrics-service';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const timeframe = new URL(request.url).searchParams.get('timeframe') || '6 months';
        const metrics = await getArtistMetrics(params.id, timeframe);
        
        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Error in metrics endpoint:', error);
        return NextResponse.json(
            { error: 'Failed to fetch artist metrics' },
            { status: 500 }
        );
    }
}