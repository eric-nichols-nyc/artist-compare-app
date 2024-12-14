// services/artist-metrics-service.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function getArtistMetrics(artistId: string, timeframe = '6 months') {
    try {
        // Calculate the date from timeframe
        const monthsAgo = parseInt(timeframe.split(' ')[0]);
        const date = new Date();
        date.setMonth(date.getMonth() - monthsAgo);
        const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format

        const { data, error } = await supabase
            .from('artist_analytics')
            .select(`
                date,
                monthly_listeners,
                youtube_subscribers,
                youtube_total_views,
                spotify_followers,
                spotify_popularity
            `)
            .eq('artist_id', artistId)
            .gte('date', formattedDate)
            .order('date', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching artist metrics:', error);
        throw error;
    }
}

export async function getArtistCurrentMetrics(artistId: string) {
    try {
        const { data, error } = await supabase
            .from('artist_analytics')
            .select(`
                monthly_listeners,
                youtube_subscribers,
                youtube_total_views,
                spotify_followers,
                spotify_popularity
            `)
            .eq('artist_id', artistId)
            .order('date', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching current artist metrics:', error);
        throw error;
    }
}