import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const getFanbaseData = unstable_cache(
  async (artist1: string, artist2: string) => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: artists, error } = await supabase
      .from('artists')
      .select(`
        id,
        name,
        artist_analytics!inner(
          spotify_followers,
          youtube_subscribers,
          instagram_followers,
          facebook_followers,
          tiktok_followers,
          soundcloud_followers
        )
      `)
      .in('name', [artist1, artist2]);

    if (error) throw error;

    return artists.map(artist => ({
      name: artist.name,
      platforms: {
        spotify: artist.artist_analytics[0]?.spotify_followers || 0,
        youtube: artist.artist_analytics[0]?.youtube_subscribers || 0,
        instagram: artist.artist_analytics[0]?.instagram_followers || 0,
        facebook: artist.artist_analytics[0]?.facebook_followers || 0,
        tiktok: artist.artist_analytics[0]?.tiktok_followers || 0,
        soundcloud: artist.artist_analytics[0]?.soundcloud_followers || 0,
      }
    }));
  },
  ['fanbase-comparison'],
  {
    revalidate: 300,
    tags: ['fanbase']
  }
);

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
    const fanbaseData = await getFanbaseData(artist1, artist2);
    
    if (!fanbaseData.length) {
      return NextResponse.json(
        { error: 'Artists not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(fanbaseData);
  } catch (error) {
    console.error('Error fetching fanbase data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fanbase data' },
      { status: 500 }
    );
  }
}
