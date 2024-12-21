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
  const [showSearch, setShowSearch] = useState(true)

  const handleArtistSelect = (artist: Artist) => {
    console.log('artist', artist)
      setSelectedArtists([...selectedArtists, artist])
      setShowSearch(false)
   
  }

  const handleRemoveArtist = (spotifyId: string) => {
    setSelectedArtists(selectedArtists.filter(a => a.spotifyId !== spotifyId))
    if (selectedArtists.length <= 1) {
      setShowSearch(true)
    }
  }

  return (
    <div className="container mx-auto p-6">
      {showSearch ? (
        <ArtistListCard onArtistSelect={handleArtistSelect} />
      ) : (
        <button
          onClick={() => setShowSearch(true)}
          className="mb-4 text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
        >
          <span>← Back to Search</span>
        </button>
      )}
      <SearchResults 
        selectedArtists={selectedArtists}
        onRemoveArtist={handleRemoveArtist}
      />
    </div>
  )
}
