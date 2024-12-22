'use client'

import { useEffect, useState, Suspense } from 'react'
import { ArtistIngestionResponse, SpotifyArtist } from '@/types/api'
import { ArtistVideos } from './artist-videos'
import { ArtistTracks } from './artist-tracks'
import { SimilarArtists } from './similar-artists'
import { ArtistAnalytics } from './artist-analytics'

interface ArtistDetailsProps {
  artist: SpotifyArtist
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  const [artistInfo, setArtistInfo] = useState<ArtistIngestionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/ingest-artist?name=' + artist.name)
        const data = await response.json()
        setArtistInfo(data)
      } catch (error) {
        console.error('Error fetching artist info:', error)
        setError('Failed to load artist details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtistInfo()
  }, [artist.name])

  if (isLoading) {
    return <div className="p-4">Loading artist details...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!artistInfo) {
    return <div className="p-4">No artist information available</div>
  }

  return (
    <div className="mt-4">
      {artistInfo.biography && (
        <div className="prose prose-sm max-w-none">
          <p>{artistInfo.biography}</p>
        </div>
      )}

      <Suspense fallback={<div className="p-4">Loading analytics...</div>}>
        <ArtistAnalytics artist={artist} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<div className="p-4">Loading videos...</div>}>
          <ArtistVideos artist={artist} />
        </Suspense>

        <Suspense fallback={<div className="p-4">Loading tracks...</div>}>
          <ArtistTracks artist={artist} />
        </Suspense>

        <Suspense fallback={<div className="p-4">Loading similar artists...</div>}>
          <SimilarArtists artist={artist} />
        </Suspense>
      </div>
    </div>
  )
} 