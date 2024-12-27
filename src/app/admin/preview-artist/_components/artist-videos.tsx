'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { SpotifyArtist } from '@/types'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface ArtistVideosProps {
  artist: SpotifyArtist
}

export function ArtistVideos({ artist }: ArtistVideosProps) {
  const { youtubeVideos, refreshYoutubeVideos, artistInfo } = useArtistFormStore();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        await refreshYoutubeVideos(artistInfo.youtubeChannelId!);
      } catch (error) {
        setError('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [artist.name, refreshYoutubeVideos]);

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num)
  }


  if (isLoading) {
    return <div className="p-4">Loading videos...</div>
  }

  if (!artistInfo.youtubeChannelId) {
    return <div className="p-4">No YouTube channel ID found</div>
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Top Videos</h4>
        {artistInfo.youtubeChannelId && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              refreshYoutubeVideos(artistInfo.youtubeChannelId!);
            }}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Videos
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 text-red-500 mb-4">{error}</div>
      )}

      {!youtubeVideos.length ? (
        <div className="p-4">No videos available</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {youtubeVideos.map((video) => (
            <Card key={video.videoId} className="p-3">
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
                    <span>{formatNumber(video.statistics.viewCount)} views</span>
                    <span>{formatNumber(video.statistics.likeCount)} likes</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 