"use client";

import { ArtistSearch } from './_components/artist-search'
import { ArtistCard } from './_components/new-artist-card'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { ContentLayout } from '@/app/(admin)/admin/_components/content-layout'
export default function PreviewArtistPage() {
  const selectedArtists = useArtistFormStore(state => state.selectedArtists)
  const hasSelectedArtist = selectedArtists.length > 0

  return (
    <ContentLayout title="Preview Artist">
      {!hasSelectedArtist ? (
        <ArtistSearch />
      ) : (
        <ArtistCard artist={selectedArtists[0]} />
      )}
    </ContentLayout>
  )
}
