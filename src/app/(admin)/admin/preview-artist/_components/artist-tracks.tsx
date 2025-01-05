'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { SpotifyArtist, ViberateSpTrack } from '@/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { SpotifyTrackInfo } from '@/validations/artist-schema'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon, Music2Icon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TracksSkeleton } from './skeletons'
import { DataSourceSelector } from '@/components/data-source-selector'
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { parseCompactNumber } from '@/lib/utils/number-format'

interface ArtistTracksProps {
  artist: SpotifyArtist
}

export function ArtistTracks({ artist }: ArtistTracksProps) {
  const { tracks, dispatch } = useArtistFormStore();
    // load tracks from viberate store
  const { viberateTracks } = useScrapedDataStore();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  async function fetchSpotifyTracks(trackIds: string[]) {
    console.log('trackIds1 = ', trackIds)
    const response = await fetch(`/api/admin/artist-tracks?spotifyIds=${trackIds.join(',')}&spotifyId=${artist.spotifyId}`)
    const data = await response.json()
    console.log('track data = ', data.tracks)
    const mergedTracks = mergeTracks(viberateTracks, data.tracks)
    console.log('mergedTracks = ', mergedTracks)
    dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: mergedTracks || [] })
  }

  useEffect(() => {
    console.log('tracks = ', tracks)
  }, [tracks])


  useEffect(() => {  
    console.log('viberateTracks = ', viberateTracks)
    const trackIds = viberateTracks.map(track => track.spotifyTrackId)
    if(trackIds.length) { 
      fetchSpotifyTracks(trackIds)
    }

  // dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: mergedTracks });
  }, [viberateTracks])

  function mergeTracks(viberateTracks: ViberateSpTrack[], spotifyTracks: Partial<SpotifyTrackInfo>[]):SpotifyTrackInfo[] {
    return viberateTracks.map((viberateTrack: ViberateSpTrack) => {
      const spotifyTrack = spotifyTracks.find(track => track.trackId === viberateTrack.spotifyTrackId);
      return {
        ...viberateTrack,
        ...spotifyTrack,
        platform: 'spotify',
        trackId: viberateTrack.spotifyTrackId,
        popularity: spotifyTrack?.popularity || 0,
        spotifyStreams: viberateTrack.monthlyStreams || null
      };
    });
  }



  // merge tracks monthly streams and total streams

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
    return <Card className="p-4">No tracks available</Card>
  }

  return (
      <Card className="mt-4">
      <h4 className="font-semibold mb-3 p-2">Top Tracks</h4>

      {/* <DataSourceSelector type="tracks" /> */}

        <ScrollArea className="h-[600px] rounded-md border">
          <div className="p-4">
            {tracks.map((track: SpotifyTrackInfo) => (
              <Card key={track.trackId} className="p-4 mb-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {track.imageUrl ? (
                      <Image
                        src={track.imageUrl}
                        alt={track.title}
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
                      <h5 className="font-medium text-sm">{track.title}</h5>
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
                          type="number"
                          value={track.spotifyStreams || 0}
                          onChange={(e) => handleStreamUpdate(track.trackId, e.target.value)}
                          className="h-8 text-sm"
                          placeholder="Enter streams"
                        />
                      </div>
                    </div>
                  </div>
                  {track.spotifyUrl && (
                    <div className="flex-shrink-0 self-center">
                      <a 
                        href={track.spotifyUrl} 
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
  )
} 