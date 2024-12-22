'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { SpotifyArtist } from '@/types/api'

interface Analytics {
  lastfmListeners?: number
  lastfmPlayCount?: number
  youtubeSubscribers?: number
  youtubeViews?: number
  spotifyFollowers?: number
  spotifyPopularity?: number
}

interface ArtistAnalyticsProps {
  artist: SpotifyArtist
}

export function ArtistAnalytics({ artist }: ArtistAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/artist-analytics?name=${encodeURIComponent(artist.name)}`)
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setError('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [artist.name])

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A'
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num)
  }

  if (isLoading) {
    return <div className="p-4">Loading analytics...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!analytics) {
    return <div className="p-4">No analytics available</div>
  }

  const platforms = [
    {
      name: 'Spotify',
      stats: [
        { label: 'Followers', value: formatNumber(analytics.spotifyFollowers) },
        { label: 'Popularity', value: analytics.spotifyPopularity || 'N/A' }
      ],
      bgColor: 'bg-green-50'
    },
    {
      name: 'YouTube',
      stats: [
        { label: 'Subscribers', value: formatNumber(analytics.youtubeSubscribers) },
        { label: 'Total Views', value: formatNumber(analytics.youtubeViews) }
      ],
      bgColor: 'bg-red-50'
    },
    {
      name: 'Last.fm',
      stats: [
        { label: 'Listeners', value: formatNumber(analytics.lastfmListeners) },
        { label: 'Play Count', value: formatNumber(analytics.lastfmPlayCount) }
      ],
      bgColor: 'bg-blue-50'
    }
  ]

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Platform Analytics</h4>
      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.name} className={`p-4 ${platform.bgColor}`}>
            <div className="flex flex-col">
              <h5 className="font-medium text-sm mb-2">{platform.name}</h5>
              <div className="grid grid-cols-2 gap-4">
                {platform.stats.map((stat) => (
                  <div key={stat.label} className="text-sm">
                    <div className="text-gray-600">{stat.label}</div>
                    <div className="font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 