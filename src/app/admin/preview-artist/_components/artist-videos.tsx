'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { SpotifyArtist } from '@/types'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { Button } from '@/components/ui/button'
import { RefreshCw, Upload } from 'lucide-react'
import { DataSourceSelector } from '@/components/data-source-selector'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ArtistVideosProps {
  artist: SpotifyArtist
}

type VideoSource = 'youtube' | 'viberate' | 'json'

export function ArtistVideos({ artist }: ArtistVideosProps) {
  const { videos, refreshYoutubeVideos, artistInfo } = useArtistFormStore()
  const [selectedSource, setSelectedSource] = useState<VideoSource>('youtube')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          const viberateResponse = await fetch(`/api/scrape/viberate/videos?artistName=${encodeURIComponent(artist.name)}`)
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
    <Card className="mt-4 flex-grow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Videos</CardTitle>
        <div className="flex items-center gap-2">
          <DataSourceSelector
            type="videos"
          />
          
          {selectedSource === 'json' ? (
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
          )}
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
                        alt={video.name || ''}
                        width={120}
                        height={68}
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h5 className="font-medium text-sm line-clamp-2">{video.name}</h5>
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