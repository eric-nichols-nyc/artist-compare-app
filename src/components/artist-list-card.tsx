import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from '@/components/motion'
import Image from 'next/image'
import { useState } from 'react'

interface RecommendedArtist {
  name: string
  country: string
  countryCode: string
  genre: string
  imageUrl: string
}

interface ArtistListCardProps {
  searchQuery?: string
  onSearchChange: (query: string) => void
  recommendedArtists: RecommendedArtist[]
  onArtistSelect?: (artist: RecommendedArtist) => void
  isLoading?: boolean
}

export function ArtistListCard({
  searchQuery,
  onSearchChange,
  recommendedArtists,
  onArtistSelect,
  isLoading = false
}: ArtistListCardProps) {
  const artists = Array.isArray(recommendedArtists) ? recommendedArtists : [];

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Compare the social media and streaming stats of any two Artists out there.</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for an artist..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <h3 className="font-semibold mb-4">
          {searchQuery ? 'Search Results' : 'Recommended Artists to compare'}
        </h3>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          ) : artists.length > 0 ? (
            artists.map((artist) => (
              <div
                key={artist.name}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => onArtistSelect?.(artist)}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={artist.imageUrl || "/images/placeholder.jpg"}
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="flex-1 text-left">{artist.name}</span>
                <div className="flex items-center gap-2">
                  <Image 
                    src={`/flags/us.svg`}
                    alt={artist.country}
                    width={20}
                    height={12}
                    className="w-5 h-3"
                  />
                  <span className="text-sm text-gray-500">{artist.genre}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No artists found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 