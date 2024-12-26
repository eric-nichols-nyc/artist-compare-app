// ArtistHeader.tsx
'use client'

import { Card } from '@/components/ui/card'
import { useArtistForm } from '@/providers/artist-form-provider'
import Image from 'next/image'
import { useEffect } from 'react'
import { SpotifyArtist } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
          spotifyId: artist.spotifyId
        }
      })
      dispatch({
        type: 'UPDATE_ANALYTICS',
        payload:{
            spotifyFollowers: artist.followers,
            spotifyPopularity: artist.popularity,
        }
      })
  }, [dispatch, artist])

  useEffect(() => {
    console.log('artistInfo', artistInfo)
    console.log('analytics', analytics)
  }, [artistInfo, analytics, artist])

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
        <div className="space-y-2 flex-1">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Artist Name</Label>
            <Input 
              id="name"
              value={artistInfo.name}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="genres">Genres</Label>
            <Input 
              id="genres"
              value={artistInfo.genres.slice(0, 3).join(', ')}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Input 
                id="gender"
                value={artistInfo.gender || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country"
                value={artistInfo.country || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Spotify ID</Label>
              <Input 
                id="spotifyId"
                value={artistInfo.spotifyId || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Spotify URL</Label>
              <Input 
                id="spotifyUrl"
                value={artistInfo.spotifyUrl || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Youtube Channel ID</Label>
              <Input 
                id="spotifyId"
                value={artistInfo.youtubeChannelId || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Youtube URL</Label>
              <Input 
                id="spotifyId"
                value={artistInfo.youtubeUrl || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Tiktok URL</Label>
              <Input 
                id="spotifyId"
                value={artistInfo.tiktokUrl || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Instagram URL</Label>
              <Input 
                id="spotifyId"
                value={artistInfo.instagramUrl || 'N/A'}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}