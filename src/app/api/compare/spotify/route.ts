import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const getArtistsTopTracks = unstable_cache(
  async (artist1: string, artist2: string) => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // First, get the artist IDs
    const { data: artists, error: artistError } = await supabase
      .from('artists')
      .select('id, name')
      .in('name', [artist1, artist2]);

    if (artistError) throw artistError;
    if (!artists || artists.length === 0) {
      throw new Error('Artists not found');
    }

    // Create a map of artist names to IDs
    const artistMap = new Map(artists.map(artist => [artist.name.toLowerCase(), artist]));
    const artistIds = artists.map(artist => artist.id);

    // Get top tracks for both artists
    const { data: tracks, error: trackError } = await supabase
      .from('artist_top_tracks')
      .select(`
        title,
        track_id,
        stream_count,
        thumbnail_url,
        artist_id,
        artists!inner(
          name
        )
      `)
      .in('artist_id', artistIds)
      .order('play_count', { ascending: false });

    if (trackError) throw trackError;
    if (!tracks) throw new Error('No tracks found');

    // Get the top track for each artist
    const topTracksByArtist = [artist1, artist2].map(artistName => {
      const artist = artistMap.get(artistName.toLowerCase());
      if (!artist) return null;

      const artistTracks = tracks.filter(track => 
        track.artist_id === artist.id
      );

      if (!artistTracks.length) return null;

      const topTrack = artistTracks[0];
      return {
        title: topTrack.title,
        thumbnailUrl: topTrack.thumbnail_url,
        plays: Number(topTrack.play_count), // Convert BigInt to Number
        artistName: artist.name,
      };
    }).filter(Boolean);

    return topTracksByArtist;
  },
  ['artists-top-tracks'],
  {
    revalidate: 300,
    tags: ['spotify']
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
    const tracks = await getArtistsTopTracks(artist1, artist2);
    
    if (!tracks.length) {
      return NextResponse.json(
        { error: 'No tracks found for the specified artists' },
        { status: 404 }
      );
    }

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching artists top tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists top tracks' },
      { status: 500 }
    );
  }
}
