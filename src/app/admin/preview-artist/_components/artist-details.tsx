'use client'

import { useEffect, useState, Suspense } from 'react'
import { ArtistIngestionResponse, SpotifyArtist } from '@/types/api'
import { ArtistVideos } from './artist-videos'
import { ArtistTracks } from './artist-tracks'
import { SimilarArtists } from './similar-artists'

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
      <div className="mt-4 grid grid-cols-2 gap-4">
        {artistInfo.lastfmListeners && (
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Last.fm Listeners</div>
            <div className="font-semibold">{artistInfo.lastfmListeners}</div>
          </div>
        )}
        {artistInfo.lastfmPlayCount && (
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Last.fm Plays</div>
            <div className="font-semibold">{artistInfo.lastfmPlayCount}</div>
          </div>
        )}
      </div>

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