'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useArtists } from '@/context/artist-context'
import { Button } from '@/components/ui/button'

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
    <div className="flex flex-col items-start gap-2 py-4">
      {artists.map((artist) => (
        <div className="flex gap-2">
        <Button variant="link" asChild key={artist.id}>
        <Link
          href={`/preview-artist/${artist.id}`}
          className="relative w-full h-10  overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
          title={artist.name}
        >
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
          <p>{artist.name}</p>
        </Link>
        </Button>
        </div>
      ))}
    </div>
  )
} 