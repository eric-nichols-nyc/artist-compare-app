// app/api/admin/preview-artist/route.ts
import { NextResponse } from 'next/server';
import { ArtistIngestionService } from '@/services/artist-ingestion-service';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

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
    const [lastFmData, youtubeData, spotifyData] = await Promise.all([
      ingestionService.getLastFmArtistInfo(artistName),
      ingestionService.getYoutubeChannelInfo(artistName),
      ingestionService.getSpotifyArtistData(artistName)
    ]);

    // Generate a brief bio using GPT-4
    const bioCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Write a concise, factual biography for ${artistName}. Include their musical style, major achievements, and cultural impact. Keep it under 200 words.`
      }],
      temperature: 0.7
    });

    // Structure the preview data
    // const previewData = {
    //   basic: {
    //     name: artistName,
    //     bio: bioCompletion.choices[0].message.content,
    //     genres: lastFmData.tags.tag.map(tag => tag.name)
    //   },
    //   platform: {
    //     youtube_channel_id: youtubeData?.id || null,
    //     lastfm_id: lastFmData.name
    //   },
    //   analytics: {
    //     monthly_listeners: parseInt(lastFmData.stats.listeners),
    //     youtube_subscribers: youtubeData 
    //       ? parseInt(youtubeData.statistics.subscriberCount) 
    //       : null,
    //     youtube_total_views: youtubeData 
    //       ? parseInt(youtubeData.statistics.viewCount) 
    //       : null,
    //     lastfm_play_count: parseInt(lastFmData.stats.playcount)
    //   },
    //   raw: {
    //     lastfm: lastFmData,
    //     youtube: youtubeData
    //   }
    // };

    const previewData = {
      name: artistName,
      bio: bioCompletion.choices[0].message.content,
      genres: lastFmData.tags.tag.map(tag => tag.name),
      spotifyId: spotifyData.id,
      lastFmId: lastFmData.name,
      youtubeChannelId: youtubeData?.id || null,
      spotifyUrl: spotifyData.external_urls.spotify,
      youtubeUrl: `https://www.youtube.com/channel/${youtubeData?.id}`,
      tiktokUrl: null,
      instagramUrl: null,
      imageUrl: spotifyData.images[0].url || null,
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