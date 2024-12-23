'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SpotifyArtist } from '@/types/api'
import { ArtistDetails } from './artist-details'

interface SearchedhArtistProps {
  selectedArtists: SpotifyArtist[]
  onRemoveArtist: (spotifyId: string) => void
}

export function AddArtistForm({ selectedArtists, onRemoveArtist }: SearchedhArtistProps) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {selectedArtists.map((artist) => (
        <Card 
          key={artist.spotifyId}
          className="relative p-4"
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
          <div className="flex flex-col">
              {/* add spotifyId */}
              <div className="text-sm text-gray-500">Spotify ID: {artist.spotifyId}</div>
              {/* add followers */}
              <div className="text-sm text-gray-500">Followers: {artist.followers}</div>
              {/* add popularity */}
              <div className="text-sm text-gray-500">Popularity: {artist.popularity}</div>
              </div>

          {/* Artist Details Section */}
          <Suspense fallback={<div className="p-4">Loading artist details...</div>}>
            <ArtistDetails artist={artist} />
          </Suspense>
        </Card>
      ))}
    </div>
  )
} 