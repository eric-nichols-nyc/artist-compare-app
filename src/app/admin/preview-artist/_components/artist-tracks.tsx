'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { SpotifyArtist } from '@/types/api'

interface Track {
  id: string
  name: string
  imageUrl?: string
  popularity?: number
  previewUrl?: string
  externalUrl?: string
}

interface ArtistTracksProps {
  artist: SpotifyArtist
}

export function ArtistTracks({ artist }: ArtistTracksProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/artist-tracks?spotifyId=${artist.spotifyId}`)
        const data = await response.json()
        setTracks(data.tracks || [])
      } catch (error) {
        console.error('Error fetching tracks:', error)
        setError('Failed to load tracks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTracks()
  }, [artist.spotifyId])

  if (isLoading) {
    return <div className="p-4">Loading tracks...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!tracks.length) {
    return <div className="p-4">No tracks available</div>
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Top Tracks</h4>
      <div className="grid grid-cols-1 gap-4">
        {tracks.slice(0, 5).map((track) => (
          <Card key={track.id} className="p-3">
            <div className="flex gap-3">
              {track.imageUrl && (
                <div className="flex-shrink-0">
                  <Image
                    src={track.imageUrl}
                    alt={track.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h5 className="font-medium text-sm line-clamp-1">{track.name}</h5>
                <div className="flex gap-4 mt-1">
                  <div className="text-sm text-gray-500">
                    Popularity: {track.popularity}
                  </div>
                  {track.previewUrl && (
                    <audio
                      controls
                      className="h-8 w-48"
                    >
                      <source src={track.previewUrl} type="audio/mpeg" />
                    </audio>
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