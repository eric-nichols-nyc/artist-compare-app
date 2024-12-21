'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Artist {
  name: string
  spotifyId: string
  imageUrl: string
  genres?: string[]
  bio?: string
  youtubeChannelId?: string
  videos?: Array<{
    title: string
    videoId: string
    views: number
    imageUrl: string
  }>
  tracks?: Array<{
    title: string
    trackId: string
    streams: number
    imageUrl: string
  }>
  analytics?: {
    monthlyListeners?: number
    youtubeSubscribers?: number
    spotifyFollowers?: number
  }
}

interface SearchResultsProps {
  selectedArtists: Artist[]
  onRemoveArtist: (spotifyId: string) => void
}

export function SearchResults({ selectedArtists, onRemoveArtist }: SearchResultsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {selectedArtists.map((artist) => (
        <Card 
          key={artist.spotifyId}
          className={`relative p-4 transition-all duration-300 ${
            expandedCard === artist.spotifyId ? 'col-span-2 row-span-2' : ''
          }`}
        >
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {artist.imageUrl && (
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{artist.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {artist.genres?.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => onRemoveArtist(artist.spotifyId)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Monthly</div>
              <div className="font-semibold">
                {formatNumber(artist.analytics?.monthlyListeners)}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">YouTube</div>
              <div className="font-semibold">
                {formatNumber(artist.analytics?.youtubeSubscribers)}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Spotify</div>
              <div className="font-semibold">
                {formatNumber(artist.analytics?.spotifyFollowers)}
              </div>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpandedCard(
              expandedCard === artist.spotifyId ? null : artist.spotifyId
            )}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {expandedCard === artist.spotifyId ? 'Show Less' : 'Show More'}
          </button>

          {/* Expanded Content */}
          {expandedCard === artist.spotifyId && (
            <div className="mt-4 space-y-4">
              {/* Bio Section */}
              {artist.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Biography</h4>
                  <ScrollArea className="h-32">
                    <p className="text-sm text-gray-600">{artist.bio}</p>
                  </ScrollArea>
                </div>
              )}

              {/* Videos Section */}
              {artist.videos && artist.videos.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Top Videos</h4>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {artist.videos.map((video) => (
                        <div key={video.videoId} className="flex items-center gap-2">
                          <Image
                            src={video.imageUrl}
                            alt={video.title}
                            width={80}
                            height={45}
                            className="rounded"
                          />
                          <div>
                            <p className="text-sm font-medium truncate">{video.title}</p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(video.views)} views
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Tracks Section */}
              {artist.tracks && artist.tracks.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Top Tracks</h4>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {artist.tracks.map((track) => (
                        <div key={track.trackId} className="flex items-center gap-2">
                          <Image
                            src={track.imageUrl}
                            alt={track.title}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div>
                            <p className="text-sm font-medium truncate">{track.title}</p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(track.streams)} streams
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
} 