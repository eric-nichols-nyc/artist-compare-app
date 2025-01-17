// app/api/admin/preview-artist/route.ts
import { NextResponse } from 'next/server';
import { ArtistIngestionService } from '@/services/artist-ingestion-service';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import SpotifyWebApi from 'spotify-web-api-node';

const ingestionService = new ArtistIngestionService();
const openai = new OpenAI();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_SECRET
});

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistName = searchParams.get('name');

    if (!artistName) {
      return NextResponse.json(
        { error: 'Artist name is required' },
        { status: 400 }
      );
    }

    // Refresh Spotify token
    const authData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authData.body['access_token']);

    // Fetch data from all sources in parallel
    const [lastFmData, youtubeData, spotifySearch] = await Promise.all([
      ingestionService.getLastFmArtistInfo(artistName),
      ingestionService.getYoutubeChannelInfo(artistName),
      spotifyApi.searchArtists(artistName, { limit: 1 })
    ]);

    let spotifyData = null;
    if (spotifySearch.body.artists?.items[0]) {
      const artistId = spotifySearch.body.artists.items[0].id;
      const [artist, topTracks] = await Promise.all([
        spotifyApi.getArtist(artistId),
        spotifyApi.getArtistTopTracks(artistId, 'US')
      ]);
      spotifyData = {
        ...artist.body,
        top_tracks: topTracks.body.tracks
      };
    }

    // Generate bio using GPT-4
    const bioCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Write a concise, factual biography for ${artistName}. Include their musical style, major achievements, and cultural impact. Keep it under 200 words.`
      }],
      temperature: 0.7
    });

    // Structure the preview data
    const previewData = {
      basic: {
        name: artistName,
        bio: bioCompletion.choices[0].message.content,
        genres: [...new Set([
          ...(lastFmData.tags.tag.map((tag: any) => tag.name) || []),
          ...(spotifyData?.genres || [])
        ])]
      },
      platform: {
        youtube_channel_id: youtubeData?.id || null,
        lastfm_id: lastFmData.name,
        spotify_id: spotifyData?.id || null
      },
      analytics: {
        monthly_listeners: parseInt(lastFmData.stats.listeners),
        youtube_subscribers: youtubeData 
          ? parseInt(youtubeData.statistics.subscriberCount) 
          : null,
        youtube_total_views: youtubeData 
          ? parseInt(youtubeData.statistics.viewCount) 
          : null,
        lastfm_play_count: parseInt(lastFmData.stats.playcount),
        spotify_followers: spotifyData?.followers.total || null,
        spotify_popularity: spotifyData?.popularity || null
      },
      spotify: {
        top_tracks: spotifyData?.top_tracks || [],
        genres: spotifyData?.genres || [],
        external_url: spotifyData?.external_urls.spotify || ''
      },
      raw: {
        lastfm: lastFmData,
        youtube: youtubeData,
        spotify: spotifyData
      }
    };

    return NextResponse.json(previewData);
  } catch (error) {
    console.error('Error fetching artist preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist preview' },
      { status: 500 }
    );
  }
}