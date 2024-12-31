"use client";

import { ArtistSearch } from './_components/artist-search'
import { ArtistCard } from './_components/new-artist-card'
import { useArtistFormStore } from '@/stores/artist-form-store'

export default function PreviewArtistPage() {
  const selectedArtists = useArtistFormStore(state => state.selectedArtists)
  const hasSelectedArtist = selectedArtists.length > 0

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {!hasSelectedArtist ? (
        <ArtistSearch />
      ) : (
        <ArtistCard artist={selectedArtists[0]} />
      )}
    </div>
  )
}
