'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { SpotifyArtist } from '@/types'
import { useArtistForm } from '@/providers/artist-form-provider'
import { YoutubeVideo } from '@/types'

interface ArtistVideosProps {
  artist: SpotifyArtist
}

export function ArtistVideos({ artist }: ArtistVideosProps) {
  const { state, dispatch } = useArtistForm();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/artist-videos?name=${encodeURIComponent(artist.name)}`)
        const data = await response.json()
        console.log('video data', data.videos)
        dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: data.videos || [] })
      } catch (error) {
        console.error('Error fetching videos:', error)
        setError('Failed to load videos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideos()
  }, [artist.name])

  const formatNumber = (num?: string) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(Number(num))
  }

  if (isLoading) {
    return <div className="p-4">Loading videos...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!state.youtubeVideos.length) {
    return <div className="p-4">No videos available</div>
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Top Videos</h4>
      <div className="grid grid-cols-1 gap-4">
        {state.youtubeVideos.map((video: YoutubeVideo) => (
          <Card key={video.id} className="p-3">
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
                  <span>{formatNumber(video.statistics?.viewCount)} views</span>
                  <span>{formatNumber(video.statistics?.likeCount)} likes</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 