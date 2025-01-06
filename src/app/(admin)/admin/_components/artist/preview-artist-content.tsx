'use client'

import { ArtistSearch } from './artist-search'
import { ArtistCard } from './new-artist-card'
import { useArtistFormStore } from '@/stores/artist-form-store'

export function PreviewArtistContent() {
  const selectedArtists = useArtistFormStore(state => state.selectedArtists)
  const hasSelectedArtist = selectedArtists.length > 0

  return (
    <>
      {!hasSelectedArtist ? (
        <ArtistSearch />
      ) : (
        <ArtistCard artist={selectedArtists[0]} />
      )}
    </>
  )
} 