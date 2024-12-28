import { NextResponse } from "next/server"
import axios from "axios"
export async function GET(req: Request) {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get('channelId')
  try {
      // Step 1: Fetch Taylor Swift's channel ID
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
      );
      const uploadsPlaylistId =
      channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
          // Step 3: Fetch all videos from the uploads playlist
    let videoIds: string[] = [];
    let nextPageToken = '';
    let hasMorePages = true;

    while (hasMorePages) {
      const videosResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
      );
      videoIds = [
        ...videoIds,
        ...videosResponse.data.items.map((item: any) => item.snippet.resourceId.videoId),
      ];
      nextPageToken = videosResponse.data.nextPageToken;
      hasMorePages = nextPageToken ? true : false;
    }

    console.log('videoIds ', videoIds)
        // Step 4: Get video statistics (views)
        const videosStatisticsResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(
              ','
            )}&key=${API_KEY}`
          );
      
          
             // Step 5: Sort the videos by view count and get the top 5
    const videosWithViews = videosStatisticsResponse.data.items.map((video: any) => ({
        title: video.snippet.title,
        viewCount: parseInt(video.statistics.viewCount, 10),
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
      }));


      console.log('videosWithViews ', videosWithViews)

       // Sort videos by view count in descending order
    videosWithViews.sort((a: any, b: any) => b.viewCount - a.viewCount);

    console.log('videosWithViews sorted ', videosWithViews)

    const top5Videos = videosWithViews.slice(0, 5);

    return NextResponse.json({ top5Videos })


  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}