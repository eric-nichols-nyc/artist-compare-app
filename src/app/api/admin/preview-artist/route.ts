// app/api/admin/preview-artist/route.ts
import { NextResponse } from 'next/server';
import { ArtistIngestionService } from '@/services/artist-ingestion-service';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { PreviewArtistResponse } from "@/types/api"

const ingestionService = new ArtistIngestionService();
const openai = new OpenAI();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistName = searchParams.get('name');

    if (!artistName) {
      return NextResponse.json(
        { error: 'Artist name is required' },
        { status: 400 }
      );
    }

    // Fetch data from multiple sources in parallel
    const [youtubeData, spotifyData, similarArtistsData ] = await Promise.all([
      ingestionService.getYoutubeChannelInfo(artistName),
      ingestionService.getSpotifyArtistData(artistName),
      ingestionService.getLastFmArtistInfo(artistName)
    ]);

    // Generate a brief bio using GPT-4
    const bioCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Write a concise, factual biography for ${artistName}. Keep it to 1 paragraph under 200 words.`
      }],
      temperature: 0.7
    });

    // Structure the preview data
   console.log('youtubeData ======== ', youtubeData)
   //console.log('spotifyData ======== ', spotifyData)
   //console.log('bioCompletion ======== ', bioCompletion.choices[0].message.content)
   //console.log('similarArtistsData ======== ', similarArtistsData)
    const previewData: PreviewArtistResponse = {
      name: artistName,
      bio: bioCompletion.choices[0].message.content,
      genres: spotifyData.artist.genres,
      spotifyId: spotifyData.artist.id,
      youtubeChannelId: youtubeData?.id || null,
      spotifyUrl: spotifyData.artist.external_urls.spotify,
      youtubeUrl: `https://www.youtube.com/channel/${youtubeData?.id}`,
      tiktokUrl: null,
      instagramUrl: null,
      imageUrl: spotifyData.artist.images[0].url || null,
      similarArtists: similarArtistsData || [],
      topTracks: spotifyData.topTracks,
      artistVideos: youtubeData?.topVideos,
      analytics: {
        monthlyListeners: 100000,
        youtubeSubscribers: youtubeData?.statistics.subscribers,
        youtubeTotalViews: 100000,
        lastfmPlayCount: 100000,
        spotifyFollowers: spotifyData.artist.followers.total,
        spotifyPopularity: 100000,
        topYoutubeVideo: youtubeData?.topVideos?.[0],
        topSpotifyTrack: spotifyData.topTracks?.[0],
      }

    };

    console.log('previewData', previewData);

    return NextResponse.json(previewData);
  } catch (error) {
    console.error('Error fetching artist preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist preview' },
      { status: 500 }
    );
  }
}