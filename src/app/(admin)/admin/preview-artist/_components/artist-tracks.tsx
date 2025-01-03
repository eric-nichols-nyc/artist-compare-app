'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { SpotifyArtist } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { SpotifyTrackInfo } from '@/validations/artist-schema'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon, Music2Icon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TracksSkeleton } from './skeletons'
import { DataSourceSelector } from '@/components/data-source-selector'

interface ArtistTracksProps {
  artist: SpotifyArtist
}

export function ArtistTracks({ artist }: ArtistTracksProps) {
  const { tracks, dispatch } = useArtistFormStore();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/artist-tracks?spotifyId=${artist.spotifyId}`)
        const data = await response.json()
        console.log('track data = ', data)
        dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: data.tracks || [] })
      } catch (error) {
        setError('Failed to load tracks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTracks()
  }, [artist.spotifyId, dispatch])


  const handleStreamUpdate = (trackId: string, streams: string) => {
    const updatedTracks = tracks.map(track => 
      track.trackId === trackId 
        ? { ...track, spotifyStreams: streams ? parseInt(streams) : null }
        : track
    );
    dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: updatedTracks });
  };

  if (isLoading) {
    return <TracksSkeleton />
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!tracks.length) {
    return <div className="p-4">No tracks available</div>
  }

  return (
    <div>
      <Card className="mt-4">
      <h4 className="font-semibold mb-3 p-2">Top Tracks</h4>

      <DataSourceSelector type="tracks" />

        <ScrollArea className="h-[600px] rounded-md border">
          <div className="p-4">
            {tracks.map((track: SpotifyTrackInfo) => (
              <Card key={track.trackId} className="p-4 mb-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {track.imageUrl ? (
                      <Image
                        src={track.imageUrl}
                        alt={track.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                        <Music2Icon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow space-y-3">
                    <div>
                      <h5 className="font-medium text-sm">{track.name}</h5>
                      <div className="text-xs text-gray-500">ID: {track.trackId}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Popularity</Label>
                        <div className="text-sm font-medium">
                          {track.popularity || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Streams</Label>
                        <Input
                          type="text"
                          value={track.spotifyStreams?.toString() || ''}
                          onChange={(e) => handleStreamUpdate(track.trackId, e.target.value)}
                          className="h-8 text-sm"
                          placeholder="Enter streams"
                        />
                      </div>
                    </div>
                  </div>
                  {track.externalUrl && (
                    <div className="flex-shrink-0 self-center">
                      <a 
                        href={track.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLinkIcon className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
} 