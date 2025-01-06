import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'


const getArtists = unstable_cache(
  async () => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

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

    if (error) throw error

    return artists.map(artist => ({
      id: artist.id,
      bio: artist.bio,
      gender: artist.gender,
      age: artist.age,
      name: artist.name,
      spotifyId: artist.spotify_id,
      youtubeChannelId: artist.youtube_channel_id,
      tictokUrl: artist.tictok_url,
      instagramUrl: artist.instagram_url,
      viberateUrl: artist.viberate_url,
      musicBrainzId: artist.last_fm_id,
      spotifyUrl: artist.spotify_url,
      tiktokUrl: artist.tiktok_url,
      facebookUrl: artist.facebook_url,
      websiteUrl: artist.website_url,
      youtubeUrl: artist.youtube_url,  
      spotifyFollowers: artist.artist_analytics[0]?.spotify_followers || 0,
      monthlyListeners: artist.artist_analytics[0]?.spotify_monthly_listeners || 0,
      youtubeSubscribers: artist.artist_analytics[0]?.youtube_subscribers || 0,
      instagramFollowers: artist.artist_analytics[0]?.instagram_followers || 0,
      popularity: artist.artist_analytics[0]?.spotify_popularity || "0",
      imageUrl: artist.image_url,
      country: artist.country,
      genres: artist.genres,
      rank: artist?.rank || 0,
      facebookFollowers: artist.artist_analytics[0]?.facebook_followers || 0,
      tiktokFollowers: artist.artist_analytics[0]?.tiktok_followers || 0,
    }))
  },
  ['artists-list-1'],
  {
    revalidate: 300,
    tags: ['artists']
  }
)

export async function GET() {
  try {
    const artists = await getArtists()
    return NextResponse.json({ artists })
  } catch (error) {
    console.error('Error fetching artists:', error)
    return NextResponse.json({ error: 'Failed to fetch artists' })
  }
}