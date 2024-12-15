// app/api/artists/route.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';
import { NextResponse } from 'next/server';

const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export async function GET() {
    try {
        const { data: artists, error } = await supabase
            .from('artists')
            .select('*')
            .order('name');

        if (error) {
            throw error;
        }

        return NextResponse.json({ artists });

    } catch (error) {
        console.error('Error fetching artists:', error);
        return NextResponse.json(
            { error: 'Failed to fetch artists' },
            { status: 500 }
        );
    }
}