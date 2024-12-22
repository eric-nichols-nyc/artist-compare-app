'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SpotifyArtist } from '@/types/api'
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
  selectedArtists: SpotifyArtist[]
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
          {/* <div className="grid grid-cols-3 gap-2 mb-4">
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
          </div> */}
        </Card>
      ))}
    </div>
  )
} 