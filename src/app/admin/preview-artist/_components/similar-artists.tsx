'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SpotifyArtist } from '@/types'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useArtistFormStore } from '@/stores/artist-form-store'

interface SimilarArtistsProps {
  artist: SpotifyArtist
}

export function SimilarArtists({ artist }: SimilarArtistsProps) {
  const { similarArtists, dispatch } = useArtistFormStore();
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarArtists = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/similar-artists?name=${artist.name}`)
        const data = await response.json()
        dispatch({ type: 'UPDATE_SIMILAR_ARTISTS', payload: data.similarArtists || [] })
      } catch (error) {
        setError('Failed to load similar artists')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarArtists()
  }, [artist.name, dispatch])

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
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4">
          {similarArtists.slice(0, 15).map((artist) => (
            <Card key={artist.id} className="p-3 mb-3">
              <div className="flex gap-3">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedArtists.includes(artist.id)}
                    onCheckedChange={(checked) => {
                      setSelectedArtists(prev =>
                        checked
                          ? [...prev, artist.id]
                          : prev.filter(id => id !== artist.id)
                      )
                    }}
                  />
                </div>
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
      </ScrollArea>
    </div>
  )
} 