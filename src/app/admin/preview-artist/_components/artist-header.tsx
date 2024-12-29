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
  const { artistInfo } = useArtistFormStore()

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
            <h1 className="text-2xl font-bold">{artist.name}</h1>
            <div className="flex flex-wrap gap-1 mt-2">
              {artist.genres?.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Social Links and Additional Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Social Links</h3>
            <SocialLinks 
              artist={artist} 
              onChange={(links) => {
                // Handle social links update
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Country</dt>
                <dd>{artistInfo.country || 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Active Years</dt>
                <dd>
                  {artistInfo.activeYears?.begin
                    ? `${artistInfo.activeYears.begin} - ${
                        artistInfo.activeYears.end || 'Present'
                      }`
                    : 'Unknown'}
                </dd>
              </div>
            </dl>
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