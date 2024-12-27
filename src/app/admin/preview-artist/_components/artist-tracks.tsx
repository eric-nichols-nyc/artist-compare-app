'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { SpotifyArtist } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useArtistForm } from '@/providers/artist-form-provider'
import { SpotifyTrack } from '@/validations/artist-form-schema'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon } from 'lucide-react'


interface ArtistTracksProps {
  artist: SpotifyArtist
}

export function ArtistTracks({ artist }: ArtistTracksProps) {
  const { state, dispatch } = useArtistForm();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/artist-tracks?spotifyId=${artist.spotifyId}`)
        const data = await response.json()
        console.log("spotifyTracks", data.tracks);
        setTracks(data.tracks || [])
        dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: data.tracks || [] })
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
        {state.spotifyTracks.slice(0, 5).map((track: SpotifyTrack) => (
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
              <div className="flex-grow space-y-2">
              <div className="space-y-1">
                  <Label>Track Id</Label>
                  <Input 
                    value={track.id}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Track Name</Label>
                  <Input 
                    value={track.name}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="space-y-1 flex-1">
                    <Label>Popularity</Label>
                    <Input 
                      value={track.popularity || 'N/A'}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  {track.externalUrl && (
                    <a href={track.externalUrl} target="_blank" rel="noopener noreferrer">
                      <Button>
                        <ExternalLinkIcon className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
                <div>
                  <div>
                    <Label>Streams</Label>
                    <Input  
                      value={track.spotifyStreams || 'N/A'}
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 