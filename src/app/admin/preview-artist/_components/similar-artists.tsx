'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useArtistFormStore } from '@/stores/artist-form-store'
import { BasicArtistInfo, SimilarArtist } from '@/types'
import { Button } from '@/components/ui/button'
import { RefreshCw, Music2 } from 'lucide-react'

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
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5" />
            Similar Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Loading similar artists...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5" />
            Similar Artists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5" />
            Similar Artists
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshSimilarArtists(artist.name)}
            className="h-8"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Select artists that are similar to {artist.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {!artistList.length ? (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            No similar artists found
          </div>
        ) : (
          <ScrollArea className="h-[500px] rounded-md">
            <div className="p-4 grid gap-3">
              {artistList.map((similarArtist: any) => (
                <Card 
                  key={similarArtist.id} 
                  className={`p-4 transition-colors hover:bg-accent/50 ${
                    similarArtist.selected ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex gap-4">
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
                    {similarArtist.imageUrl ? (
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={similarArtist.imageUrl}
                          alt={similarArtist.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Music2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <h5 className="font-medium text-sm truncate">{similarArtist.name}</h5>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {similarArtist.genres?.slice(0, 3).map((genre: string) => (
                          <Badge 
                            key={genre} 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      {similarArtist.match && (
                        <div className="mt-2">
                          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${Math.round(similarArtist.match * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(similarArtist.match * 100)}% match
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
} 