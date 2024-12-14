import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from '@/components/motion'
import Image from 'next/image'

interface RecommendedArtist {
  name: string
  country: string
  countryCode: string
  genre: string
  imageUrl: string
}

interface ArtistListCardProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  recommendedArtists: RecommendedArtist[]
  onArtistSelect?: (artist: RecommendedArtist) => void
}

export function ArtistListCard({
  searchQuery,
  onSearchChange,
  recommendedArtists,
  onArtistSelect
}: ArtistListCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Compare Artists</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 mb-6">
          Compare the social media and streaming stats of any two Artists out there.
        </p>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <h3 className="font-semibold mb-4">Recommended Artists to compare</h3>
        <div className="space-y-3">
          {recommendedArtists.map((artist) => (
            <motion.button
              key={artist.name}
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => onArtistSelect?.(artist)}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={artist.imageUrl || "https://github.com/shadcn.png"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="flex-1 text-left">{artist.name}</span>
              <div className="flex items-center gap-2">
                <img 
                  src={`/flags/${artist.countryCode.toLowerCase()}.svg`}
                  alt={artist.country}
                  className="w-5 h-4"
                />
                <span className="text-sm text-gray-500">{artist.genre}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 