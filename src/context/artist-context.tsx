'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type Artist = {
  id: string
  name: string
  imageUrl: string
}

type ArtistContextType = {
  artists: Artist[]
  addArtist: (artist: Artist) => void
  setArtists: (artists: Artist[]) => void
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined)

export function ArtistProvider({ children }: { children: ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>([])

  const addArtist = useCallback((newArtist: Artist) => {
    setArtists(prev => [...prev, newArtist])
  }, [])

  return (
    <ArtistContext.Provider value={{ artists, addArtist, setArtists }}>
      {children}
    </ArtistContext.Provider>
  )
}

export function useArtists() {
  const context = useContext(ArtistContext)
  if (!context) {
    throw new Error('useArtists must be used within an ArtistProvider')
  }
  return context
} 