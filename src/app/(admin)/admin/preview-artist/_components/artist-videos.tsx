'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { Button } from '@/components/ui/button'
import { RefreshCw, Upload } from 'lucide-react'
import { DataSourceSelector } from '@/components/data-source-selector'
import { ScrollArea } from '@/components/ui/scroll-area'


type VideoSource = 'youtube' | 'viberate' | 'json'

export function ArtistVideos() {
  const { dispatch, videos, refreshYoutubeVideos, artistInfo } = useArtistFormStore()
  // get videos from viberate store
  const { viberateVideos } = useScrapedDataStore()
  const [selectedSource, setSelectedSource] = useState<VideoSource>('youtube')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   console.log("ArtistVideos component mounted", artistInfo.name);
  //   async function fetchVideos() {
  //     if (!artistInfo.youtubeChannelId) return;
  //     setIsLoading(true)
  //     try {
  //       const response = await fetch(`/api/admin/artist-videos?channelId=${artistInfo.youtubeChannelId}`);
  //       if (!response.ok) throw new Error('Failed to fetch videos');
        
  //       const data = await response.json();
  //       console.log('video response = ', data.videos)
  //       dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: data.videos || [] });
  //     } catch (error) {
  //       console.error('Error fetching videos:', error);
  //       setError('Failed to fetch videos');
  //     }finally{
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchVideos();
  // }, [artistInfo.youtubeChannelId, dispatch]);
  const fetchYoutubeVideos = async (videoIds: string[]) => {  
    console.log('videoIds ========== ', videoIds)
    try{
      const response = await fetch(`/api/admin/artist-videos?videoIds=${videoIds.join(',')}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();      
      dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: data.videos || [] });
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos');
    }
  }
  // when the viberateVideos change, fetch the youtube videos
  useEffect(() => {
    console.log('viberateVideos = ', viberateVideos)
    const videoIds = viberateVideos
      .map(video => video.videoId)
      .filter((id): id is string => !!id)
      .map(url => url.split('=')[1]); // Extract ID from watch?v= URLs

    if(videoIds.length) { 
      fetchYoutubeVideos(videoIds)
    }
  }, [viberateVideos])  

  const handleSourceChange = async (source: VideoSource) => {
    setSelectedSource(source)
    setIsLoading(true)
    setError(null)

    try {
      switch (source) {
        case 'youtube':
          await refreshYoutubeVideos(artistInfo.youtubeChannelId!)
          break
        case 'viberate':
          // Add Viberate fetch logic
          const viberateResponse = await fetch(`/api/scrape/viberate/videos?artistName=${encodeURIComponent(artistInfo.name)}`)
          if (!viberateResponse.ok) throw new Error('Failed to load Viberate videos')
          break
        case 'json':
          // Add JSON upload logic here
          break
      }
    } catch (error) {
      setError(`Failed to load videos from ${source}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJsonUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const jsonData = JSON.parse(content)
      console.log(jsonData)
      // Add logic to process and validate JSON data
      // Update videos in store
    } catch (error) {
      setError('Failed to parse JSON file')
    }
  }

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Top Videos</CardTitle>
        <div className="flex items-center gap-2">
          {/* <DataSourceSelector
            type="videos"
          /> */}
          
          {/* {selectedSource === 'json' ? (
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload JSON
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleJsonUpload}
                />
              </label>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSourceChange(selectedSource)}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Videos
            </Button>
          )} */}
        </div>
      </CardHeader>

      {error && (
        <div className="p-4 text-red-500 mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="p-4">Loading videos...</div>
      ) : !videos.length ? (
        <div className="p-4">No videos available</div>
      ) : (
        <ScrollArea className="h-[600px] rounded-md border">
          <div className="p-4">
            {videos.map((video) => (
              <Card key={video.videoId} className="p-3 mb-4">
                <div className="flex gap-3">
                  {video.thumbnail && (
                    <div className="flex-shrink-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title || ''}
                        width={120}
                        height={68}
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h5 className="font-medium text-sm line-clamp-2">{video.title}</h5>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{formatNumber(video.viewCount)} views</span>
                      <span>{formatNumber(video.likeCount)} likes</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  )
} 