// app/api/admin/preview-artist/route.ts
import { NextResponse } from 'next/server';
import { ArtistIngestionService } from '@/services/artist-ingestion-service';
import { OpenAI } from 'openai';
import type { PreviewArtistResponse } from "@/types/api"
import { unstable_cache } from 'next/cache';

const ingestionService = new ArtistIngestionService();
const openai = new OpenAI();

// Create a cached version of the preview data fetcher
const getPreviewData = unstable_cache(
  async (artistName: string) => {
    const [youtubeData, spotifyData, similarArtistsData] = await Promise.all([
      ingestionService.getYoutubeChannelInfo(artistName),
      ingestionService.getSpotifyArtistData(artistName),
      ingestionService.getLastFmArtistInfo(artistName)
    ]);

    const bioCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Write a concise, factual biography for ${artistName}. Keep it to 1 paragraph under 200 words.`
      }],
      temperature: 0.7
    });

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
        youtubeTotalViews: youtubeData?.statistics.viewCount,
        lastfmPlayCount: 100000,
        spotifyFollowers: spotifyData.artist.followers.total,
        spotifyPopularity: spotifyData.artist.popularity,
        topYoutubeVideo: youtubeData?.topVideos?.[0],
        topSpotifyTrack: spotifyData.topTracks?.[0],
      }
    };

    return previewData;
  },
  ['artist-preview'], // Cache tag
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['artist-preview']
  }
);

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

    const previewData = await getPreviewData(artistName);
    return NextResponse.json(previewData);

  } catch (error) {
    console.error('Error fetching artist preview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist preview' },
      { status: 500 }
    );
  }
}