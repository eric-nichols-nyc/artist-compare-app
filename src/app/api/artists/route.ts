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
    "genres": ["pop", "country pop", "dance pop"]
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
    "genres": ["r&b", "pop", "dance pop"]
  },
]

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json({ artists: mockArtists })
}