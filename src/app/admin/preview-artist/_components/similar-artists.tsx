'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useArtistFormStore } from '@/stores/artist-form-store'
// import { SimilarArtist } from '@/validations/artist-form-schema'
import { BasicArtistInfo, SimilarArtist } from '@/types'
import { Button } from '@/components/ui/button'
interface SimilarArtistsProps {
  artist: BasicArtistInfo
}

export function SimilarArtists({ artist }: SimilarArtistsProps) {
  const { similarArtists, dispatch, refreshSimilarArtists } = useArtistFormStore();
  const [artistList, setArtistList] = useState<SimilarArtist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarArtists = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/similar-spotify-artists?name=${artist.name}`)
        const data = await response.json()
        setArtistList(data)
      } catch (error) {
        setError('Failed to load similar artists')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarArtists()
  }, [artist.name, dispatch])

  if (isLoading) {
    return <div className="p-4">Loading similar artists...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }


  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Similar Artists</h4>
      <Button onClick={() => refreshSimilarArtists(artist.name)}>Refresh</Button>
      {
        !artistList.length && (
          <div className="p-4">No similar artists found</div>
        )
      }
      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4">
          {artistList.map((similarArtist: any) => (
            <Card key={similarArtist.id} className="p-3 mb-3">
              <div className="flex gap-3">
                <div className="flex items-center">
                  <Checkbox
                    checked={similarArtist.selected}
                    onCheckedChange={(checked) => {
                      dispatch({
                        type: 'UPDATE_SIMILAR_ARTIST_SELECTION',
                        payload: {
                          ...similarArtist,
                          selected: checked as boolean
                        }
                      })
                    }}
                  />
                </div>
                {similarArtist.imageUrl && (
                  <div className="flex-shrink-0">
                    <Image
                      src={similarArtist.imageUrl}
                      alt={similarArtist.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h5 className="font-medium text-sm">{similarArtist.name}</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {similarArtist.genres?.slice(0, 2).map((genre: string) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-gray-500">
                    {similarArtist.match && (
                      <span>Match: {Math.round(similarArtist.match * 100)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 