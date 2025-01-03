// // app/api/artists/route.ts
// import { NextResponse } from "next/server"
// import { createClient } from '@supabase/supabase-js';

// export async function GET() {
//   const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

//   const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
//   // return all artists

//   try {
//     const { data, error } = await supabase.from('artists').select('*')
//     if (error) {
//       return new NextResponse("Internal Error", { status: 500 })
//     }
//     return NextResponse.json(data)
//   } catch (error) {
//     return new NextResponse("Internal Error", { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const mockArtists = [
  {
    "id": "artist-1",
    "name": "Taylor Swift",
    "spotifyFollowers": 16430126,
    "monthlyListeners": 52438837,
    "youtubeSubscribers": 8760905,
    "instagramFollowers": 72106569,
    "popularity": "99",
    "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0",
    "country": "US",
    "genres": ["pop", "country pop", "dance pop"],
    "facebookFollowers": 75234567,
    "tiktokFollowers": 55678901,
  },
  {
    "id": "artist-2",
    "name": "Beyonce",
    "spotifyFollowers": 16430126,
    "monthlyListeners": 52438837,
    "youtubeSubscribers": 8760905,
    "instagramFollowers": 72106569,
    "popularity": "99",
    "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb12e3f20d05a8d6cfde988715",
    "country": "US",
    "genres": ["r&b", "pop", "dance pop"],
    "facebookFollowers": 62345678,
    "tiktokFollowers": 48765432,
  },
]

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!

  // If we're missing env vars or in development, return mock data
  // if (!SUPABASE_URL || !SUPABASE_KEY || process.env.NODE_ENV === 'development') {
  //   await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network latency
  //   return NextResponse.json({ artists: mockArtists })
  // }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  try {
    const { data: artists, error } = await supabase
      .from('artists')
      .select(`
        *,
        artist_analytics!inner(
          spotify_followers,
          spotify_monthly_listeners,
          youtube_subscribers,
          instagram_followers,
          facebook_followers,
          tiktok_followers,
          spotify_popularity
        )
      `)
      .order('name')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ artists: mockArtists })
    }

    // Transform the data to match the expected format
    const transformedArtists = artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      spotifyFollowers: artist.artist_analytics[0]?.spotify_followers || 0,
      monthlyListeners: artist.artist_analytics[0]?.spotify_monthly_listeners || 0,
      youtubeSubscribers: artist.artist_analytics[0]?.youtube_subscribers || 0,
      instagramFollowers: artist.artist_analytics[0]?.instagram_followers || 0,
      popularity: artist.artist_analytics[0]?.spotify_popularity || "0",
      imageUrl: artist.image_url,
      country: artist.country,
      genres: artist.genres,
      facebookFollowers: artist.artist_analytics[0]?.facebook_followers || 0,
      tiktokFollowers: artist.artist_analytics[0]?.tiktok_followers || 0,
    }))
    console.log(transformedArtists)

    return NextResponse.json({ artists: transformedArtists })
  } catch (error) {
    console.error('Error fetching artists:', error)
    return NextResponse.json({ artists: mockArtists })
  }
}