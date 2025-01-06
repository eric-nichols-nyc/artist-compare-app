import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const getArtistsTopVideos = unstable_cache(
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

    // Get top videos for both artists
    const { data: videos, error: videoError } = await supabase
      .from('artist_videos')
      .select(`
        title,
        youtube_id,
        view_count,
        artist_id,
        artists!inner(
          name
        )
      `)
      .in('artist_id', artistIds)
      .order('view_count', { ascending: false });

    if (videoError) throw videoError;
    if (!videos) throw new Error('No videos found');

    // Get the top video for each artist
    const topVideosByArtist = [artist1, artist2].map(artistName => {
      const artist = artistMap.get(artistName.toLowerCase());
      if (!artist) return null;

      const artistVideos = videos.filter(video => 
        video.artist_id === artist.id
      );

      if (!artistVideos.length) return null;

      const topVideo = artistVideos[0];
      return {
        title: topVideo.title,
        thumbnailUrl: `https://img.youtube.com/vi/${topVideo.youtube_id}/maxresdefault.jpg`,
        views: Number(topVideo.view_count), // Convert BigInt to Number
        artistName: artist.name,
      };
    }).filter(Boolean);

    return topVideosByArtist;
  },
  ['artists-top-videos'],
  {
    revalidate: 300,
    tags: ['youtube']
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
    const videos = await getArtistsTopVideos(artist1, artist2);
    
    if (!videos.length) {
      return NextResponse.json(
        { error: 'No videos found for the specified artists' },
        { status: 404 }
      );
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching artists top videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists top videos' },
      { status: 500 }
    );
  }
}
