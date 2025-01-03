"use client"

import { Artist } from "@/types"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { ArtistHeader } from "../../preview-artist/_components/artist-header"
import { ArtistAnalytics } from "../../preview-artist/_components/artist-analytics"
import { useArtistFormStore } from "@/stores/artist-form-store"

interface EditArtistSheetProps {
  artist: Artist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditArtistSheet({ artist, open, onOpenChange }: EditArtistSheetProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { dispatch } = useArtistFormStore()

  useEffect(() => {
    // if (artist && open) {
    //   // Transform the artist data to match the form store structure
    //   dispatch({
    //     type: 'SELECT_ARTIST',
    //     payload: {
    //       id: artist.id,
    //       name: artist.name,
    //       imageUrl: artist.imageUrl || null,
    //       genres: artist.genres || [],
    //       spotifyId: artist.spotifyId || '',
    //       // ... map other required fields
    //     }
    //   })
    //   setIsLoading(false)
    // }
  }, [artist, open, dispatch])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Artist</SheetTitle>
          <SheetDescription>
            Make changes to the artist profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {!isLoading && artist && (
          <div className="space-y-6 py-6">
            <ArtistHeader artist={artist} />
            <ArtistAnalytics artist={artist} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
} 