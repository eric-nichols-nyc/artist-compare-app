'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useArtists } from '@/context/artist-context'

export function ArtistList() {
  const { artists, setArtists } = useArtists()

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await fetch('/api/artists')
      const data = await response.json()
      setArtists(data.artists)
    }

    if (artists.length === 0) {
      fetchArtists()
    }
  }, [])

  return (
    <div className="flex flex-col gap-2 py-4">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          href={`/admin/preview-artist/${artist.id}`}
          className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors group"
        >
          <div className="relative w-10 h-10">
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
            {artist.name}
          </span>
        </Link>
      ))}
    </div>
  )
} 