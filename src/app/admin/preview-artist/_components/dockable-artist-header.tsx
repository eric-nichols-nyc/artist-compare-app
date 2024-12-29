'use client'

import { useEffect, useState } from 'react'
import { SpotifyArtist } from '@/types'
import Image from 'next/image'
import { ScrapeOptionsPanel } from '@/components/scrape-options-panel'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { cn } from '@/lib/utils'

interface DockableArtistHeaderProps {
  artist: SpotifyArtist
}

export function DockableArtistHeader({ artist }: DockableArtistHeaderProps) {
  const [isDocked, setIsDocked] = useState(false)
  const artistInfo = useArtistFormStore(state => state.artistInfo)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsDocked(scrollPosition > 100) // Adjust this value as needed
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-in-out bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        isDocked ? 'fixed top-0 left-0 right-0 shadow-md z-50' : 'relative'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {artist.imageUrl && (
              <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h2 className="text-lg font-semibold">{artist.name}</h2>
          </div>
          <ScrapeOptionsPanel 
            artistName={artist.name}
            spotifyId={artist.spotifyId}
            youtubeChannelId={artistInfo.youtubeChannelId}
            variant="compact"
          />
        </div>
      </div>
    </div>
  )
} 