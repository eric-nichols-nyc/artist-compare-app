// import { NextResponse } from "next/server"
// import axios from "axios"
// export async function GET(req: Request) {
//     const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API
//   const { searchParams } = new URL(req.url)
//   const channelId = searchParams.get('channelId')
//   try {
//       // Step 1: Fetch Taylor Swift's channel ID
//       const channelResponse = await axios.get(
//         `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
//       );
//       const uploadsPlaylistId =
//       channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
//           // Step 3: Fetch all videos from the uploads playlist
//     let videoIds: string[] = [];
//     let nextPageToken = '';
//     let hasMorePages = true;

//     while (hasMorePages) {
//       const videosResponse = await axios.get(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
//       );
//       videoIds = [
//         ...videoIds,
//         ...videosResponse.data.items.map((item: any) => item.snippet.resourceId.videoId),
//       ];
//       nextPageToken = videosResponse.data.nextPageToken;
//       hasMorePages = nextPageToken ? true : false;
//     }

//     console.log('videoIds ', videoIds)
//         // Step 4: Get video statistics (views)
//         const videosStatisticsResponse = await axios.get(
//             `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(
//               ','
//             )}&key=${API_KEY}`
//           );
      
          
//              // Step 5: Sort the videos by view count and get the top 5
//     const videosWithViews = videosStatisticsResponse.data.items.map((video: any) => ({
//         title: video.snippet.title,
//         viewCount: parseInt(video.statistics.viewCount, 10),
//         videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
//       }));


//       console.log('videosWithViews ', videosWithViews)

//        // Sort videos by view count in descending order
//     videosWithViews.sort((a: any, b: any) => b.viewCount - a.viewCount);

//     console.log('videosWithViews sorted ', videosWithViews)

//     const top5Videos = videosWithViews.slice(0, 5);

//     return NextResponse.json({ top5Videos })


//   } catch (error) {
//     console.error('Error fetching videos:', error)
//     return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
//   }
// }
// app/api/youtube/top-videos/route.ts

import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const youtube = google.youtube('v3');
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API;

// Cache the channel ID lookup
const getChannelId = unstable_cache(
    async () => {
        const channelResponse = await youtube.search.list({
            key: YOUTUBE_API_KEY,
            part: ['id'],
            q: 'Rihanna official',
            type: ['channel'],
            maxResults: 1
        });
        return channelResponse.data.items?.[0]?.id?.channelId;
    },
    ['rihanna-channel-id'],
    {
        revalidate: 60 * 60 * 24, // Cache for 24 hours
        tags: ['youtube-channel']
    }
);

// Cache the video list and details
const getTopVideos = unstable_cache(
    async (channelId: string) => {
        // Get videos from channel sorted by views
        const videosResponse = await youtube.search.list({
            key: YOUTUBE_API_KEY,
            part: ['id', 'snippet'],
            channelId: channelId,
            type: ['video'],
            order: 'viewCount',
            maxResults: 50
        });

        if (!videosResponse.data.items?.length) {
            return [];
        }

        // Get detailed video statistics
        const videoIds = videosResponse.data.items
            .map(item => item.id?.videoId)
            .filter((id): id is string => id !== undefined);

        const videoDetails = await youtube.videos.list({
            key: YOUTUBE_API_KEY,
            part: ['snippet', 'statistics', 'contentDetails'],
            id: videoIds
        });

        return videoDetails.data.items?.map(video => ({
            id: video.id,
            title: video.snippet?.title,
            description: video.snippet?.description,
            thumbnail: video.snippet?.thumbnails?.high?.url,
            url: `https://youtube.com/watch?v=${video.id}`,
            statistics: {
                views: parseInt(video.statistics?.viewCount || '0'),
                likes: parseInt(video.statistics?.likeCount || '0'),
                comments: parseInt(video.statistics?.commentCount || '0')
            },
            duration: video.contentDetails?.duration,
            publishedAt: video.snippet?.publishedAt
        })) || [];
    },
    ['rihanna-top-videos'],
    {
        revalidate: 60 * 60, // Cache for 1 hour
        tags: ['youtube-videos']
    }
);

export async function GET() {
    if (!YOUTUBE_API_KEY) {
        return NextResponse.json(
            { error: 'YouTube API key not configured' },
            { status: 500 }
        );
    }

    try {
        // Get channel ID from cache or fetch it
        const channelId = await getChannelId();

        if (!channelId) {
            return NextResponse.json(
                { error: 'Channel not found' },
                { status: 404 }
            );
        }

        // Get videos from cache or fetch them
        const videos = await getTopVideos(channelId);

        if (!videos.length) {
            return NextResponse.json(
                { error: 'No videos found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            channelId,
            videos,
            metadata: {
                cachedAt: new Date().toISOString(),
                videoCount: videos.length
            }
        });

    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch YouTube data' },
            { status: 500 }
        );
    }
}