'use client'

import { useState } from 'react'
import { ArtistListCard } from './search'
import { SearchResults } from './search-results'

interface Artist {
  name: string
  spotifyId: string
  imageUrl: string
}

export default function PreviewArtistPage() {
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([])

  const handleArtistSelect = (artist: Artist) => {
    console.log('artist', artist)
      setSelectedArtists([...selectedArtists, artist])
  }

  const handleRemoveArtist = (spotifyId: string) => {
    setSelectedArtists(selectedArtists.filter(a => a.spotifyId !== spotifyId))
  }

  return (
    <div className="container mx-auto p-6">
        <ArtistListCard onArtistSelect={handleArtistSelect} />
      <SearchResults 
        selectedArtists={selectedArtists}
        onRemoveArtist={handleRemoveArtist}
      />
    </div>
  )
}
