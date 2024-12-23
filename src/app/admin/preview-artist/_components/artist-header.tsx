// ArtistHeader.tsx
'use client'

import { Card } from '@/components/ui/card'
import { useArtistForm } from '@/providers/artist-form-provider'
import Image from 'next/image'
import { useEffect } from 'react'
import { SpotifyArtist } from '@/types'
export function ArtistHeader({artist}: {artist: SpotifyArtist}) {
  const { state, dispatch } = useArtistForm()
  const { artistInfo, analytics } = state

  // Update artistInfo when selectedArtists changes
  useEffect(() => {
      dispatch({
        type: 'UPDATE_ARTIST_INFO',
        payload: {
          name: artist.name,
          imageUrl: artist.imageUrl,
          genres: artist.genres,
        }
      })
      dispatch({
        type: 'UPDATE_ANALYTICS',
        payload:{
            spotifyFollowers: artist.followers,
            spotifyPopularity: artist.popularity,
        }
      })
  }, [dispatch])

  useEffect(() => {
    console.log('artistInfo', artistInfo)
    console.log('analytics', analytics)
  }, [artistInfo, analytics])

  if (!artistInfo) {
    return <div className="p-4">No artist information available</div>
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {artistInfo.imageUrl && (
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={artistInfo.imageUrl}
              alt={artistInfo.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{artistInfo.name}</h2>
          <div className="text-sm text-gray-500">
            {artistInfo.genres.slice(0, 3).join(', ')}
          </div>
        </div>
      </div>
    </Card>
  )
}