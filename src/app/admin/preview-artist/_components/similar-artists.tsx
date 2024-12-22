'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SpotifyArtist } from '@/types/api'

interface SimilarArtist {
  id: string
  name: string
  imageUrl?: string
  genres?: string[]
  match?: number
}

interface SimilarArtistsProps {
  artist: SpotifyArtist
}

export function SimilarArtists({ artist }: SimilarArtistsProps) {
  const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarArtists = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/similar-artists?name=${artist.name}`)
        const data = await response.json()
        setSimilarArtists(data.artists || [])
      } catch (error) {
        console.error('Error fetching similar artists:', error)
        setError('Failed to load similar artists')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarArtists()
  }, [artist.spotifyId])

  if (isLoading) {
    return <div className="p-4">Loading similar artists...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!similarArtists.length) {
    return <div className="p-4">No similar artists found</div>
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Similar Artists</h4>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        {similarArtists.slice(0, 6).map((artist) => (
          <Card key={artist.id} className="p-3">
            <div className="flex gap-3">
              {artist.imageUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h5 className="font-medium text-sm">{artist.name}</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {artist.genres?.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-1 text-xs text-gray-500">
                  {artist.match && (
                    <span>Match: {Math.round(artist.match * 100)}%</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 