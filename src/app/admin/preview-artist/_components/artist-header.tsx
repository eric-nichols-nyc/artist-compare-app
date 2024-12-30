// ArtistHeader.tsx
'use client'

import { Card } from '@/components/ui/card'
import { useArtistFormStore } from '@/stores/artist-form-store'
import Image from 'next/image'
import { SpotifyArtist } from '@/types'
import { Badge } from '@/components/ui/badge'
import { SocialLinks } from '@/components/SocialLinks'
import { HeaderSkeleton } from './skeletons'
import { ArtistDetails } from './artist-details'
import { Suspense } from 'react'

interface ArtistHeaderProps {
  artist: SpotifyArtist
}

export function ArtistHeader({ artist }: ArtistHeaderProps) {
  const { artistInfo, dispatch } = useArtistFormStore()

  const handleSocialLinkChange = (field: keyof ArtistInfo, value: string | null) => {
    dispatch({
      type: 'UPDATE_ARTIST_INFO',
      payload: { [field]: value }
    });
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Image and Basic Info */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full max-w-[300px] rounded-lg overflow-hidden">
            {artist.imageUrl && (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
            <div className="top-info flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="country flex items-center gap-1.5" title={artistInfo.country || 'Unknown'}>
                  {artistInfo.country && (
                    <Image
                      src={`/flags/${artistInfo.country.toLowerCase()}.svg`}
                      alt={artistInfo.country}
                      width={16}
                      height={12}
                      className="inline-block"
                    />
                  )}
                  <em>{artistInfo.country || 'Unknown'}</em>
                </span>
                <div className="genres" title={artist.genres?.join(', ')}>
                {artist.genres?.join(', ')}
              </div>
              </div>
  
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Born:</span>
                <span>
                  {artistInfo.activeYears?.begin
                    ? `${artistInfo.activeYears.begin} - ${
                        artistInfo.activeYears.end || 'Present'
                      }`
                    : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Social Links */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Social Links</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Spotify ID</label>
                <input
                  type="text"
                  value={artistInfo.spotifyId || ''}
                  onChange={(e) => handleSocialLinkChange('spotifyId', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter Spotify ID"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">YouTube Channel ID</label>
                <input
                  type="text"
                  value={artistInfo.youtubeChannelId || ''}
                  onChange={(e) => handleSocialLinkChange('youtubeChannelId', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter YouTube Channel ID"
                />
              </div>
            </div>
            <SocialLinks 
              artist={artist} 
              onChange={(links) => {
                // Handle social links update
              }}
            />
          </div>
        </div>

        {/* Column 3: Bio */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Biography</h3>
          <div className="flex-grow">
            <Suspense fallback={<HeaderSkeleton />}>
              <ArtistDetails artist={artist} />
            </Suspense>
          </div>
        </div>
      </div>
    </Card>
  )
}