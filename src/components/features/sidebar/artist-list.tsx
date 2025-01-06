'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useArtists } from '@/context/artist-context'

export function ArtistList() {
  const { artists, addArtist } = useArtists()

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await fetch('/api/artists')
      const data = await response.json()
      // Initialize the context with fetched artists
      data.artists.forEach((artist: any) => {
        addArtist(artist)
      })
    }

    if (artists.length === 0) {
      fetchArtists()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          href={`/preview-artist/${artist.id}`}
          className="relative w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
          title={artist.name}
        >
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover"
          />
        </Link>
      ))}
    </div>
  )
} 