"use client"
import { ArtistProfileCard } from './artist-profile-card'
import { ArtistListCard } from './artist-list-card'

interface Artist {
  name: string
  country: string
  countryCode: string
  genre: string
  imageUrl: string
  rankings: {
    pop: number
    mainstreamPop: number
    overall: number
  }
}

interface ArtistComparisonSectionProps {
  artist: Artist
  title: string
  searchQuery: string
  onSearchChange: (query: string) => void
  recommendedArtists: Array<Omit<Artist, 'rankings'>>
  onArtistSelect: (artist: Omit<Artist, 'rankings'>) => void
  reversed?: boolean
}

export function ArtistComparisonSection({
  artist,
  title,
  searchQuery,
  onSearchChange,
  recommendedArtists,
  onArtistSelect,
  reversed
}: ArtistComparisonSectionProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <ArtistProfileCard 
        {...artist}
        overallRankChange={artist.name === 'Travis Scott' ? 2 : 3}
        onChangeArtist={() => {
          console.log(`Change ${artist.name} clicked`)
        }}
        reversed={reversed}
      />
      <ArtistListCard
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        recommendedArtists={recommendedArtists}
        onArtistSelect={onArtistSelect}
      />
    </div>
  )
} 