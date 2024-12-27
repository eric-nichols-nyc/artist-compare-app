// ArtistHeader.tsx
'use client'

import { Card } from '@/components/ui/card'
import { useArtistFormStore } from '@/stores/artist-form-store'
import Image from 'next/image'
import { useEffect } from 'react'
import { SpotifyArtist } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export function ArtistHeader({artist}: {artist: SpotifyArtist}) {
  const { artistInfo, analytics, dispatch } = useArtistFormStore()

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

  const handleChange = (field: keyof typeof artistInfo, value: string) => {
    dispatch({
      type: 'UPDATE_ARTIST_INFO',
      payload: {
        ...artistInfo,
        [field]: value
      }
    })
  }

  if (!artistInfo) {
    return <div className="p-4">No artist information available</div>
  }

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        {artistInfo.imageUrl && (
          <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={artistInfo.imageUrl}
              alt={artistInfo.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="space-y-6 flex-1">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Artist Name</Label>
              <Input 
                id="name"
                defaultValue={artistInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender"
                  defaultValue={artistInfo.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country"
                  defaultValue={artistInfo.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="genres">Genres</Label>
              <Input 
                id="genres"
                defaultValue={artistInfo.genres.slice(0, 3).join(', ')}
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Platform IDs Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-500">Platform IDs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="spotifyId">Spotify ID</Label>
                <Input 
                  id="spotifyId"
                  value={artistInfo.spotifyId || 'N/A'}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="musicbrainzId">MusicBrainz ID</Label>
                <Input 
                  id="musicbrainzId"
                  defaultValue={artistInfo.musicbrainzId || ''}
                  onChange={(e) => handleChange('musicbrainzId', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="youtubeChannelId">Youtube Channel ID</Label>
                <div className="flex gap-2">
                  <Input 
                    id="youtubeChannelId"
                    defaultValue={artistInfo.youtubeChannelId || ''}
                    onChange={(e) => handleChange('youtubeChannelId', e.target.value)}
                    className="bg-gray-50"
                  />
                  {artistInfo.youtubeChannelId && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        useArtistFormStore.getState().refreshYoutubeVideos(artistInfo.youtubeChannelId!);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-500">Social Links</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="spotify">Spotify</Label>
                <Input 
                  id="spotifyUrl"
                  defaultValue={artistInfo.spotifyUrl || ''}
                  onChange={(e) => handleChange('spotifyUrl', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="youtube">YouTube</Label>
                <Input 
                  id="youtube"
                  defaultValue={artistInfo.youtubeUrl || ''}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram"
                  defaultValue={artistInfo.instagramUrl || ''}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="tiktok">TikTok</Label>
                <Input 
                  id="tiktok"
                  defaultValue={artistInfo.tiktokUrl || ''}
                  onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="viberate">Viberate</Label>
                <Input 
                  id="viberate"
                  defaultValue={artistInfo.viberateUrl || ''}
                  onChange={(e) => handleChange('viberateUrl', e.target.value)}
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}