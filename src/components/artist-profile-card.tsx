import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Image from 'next/image'

interface ArtistProfileProps {
  name: string
  country: string
  countryCode: string
  genre: string
  imageUrl: string
  rankings: {
    overall: number
    [key: string]: number  // For other genre rankings
  }
  overallRankChange?: number
  onChangeArtist?: () => void
  reversed?: boolean
}

export function ArtistProfileCard({
  name,
  country,
  countryCode,
  genre,
  imageUrl,
  rankings,
  overallRankChange,
  onChangeArtist,
  reversed
}: ArtistProfileProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className={`flex justify-between gap-8 ${reversed ? 'flex-row-reverse' : ''}`}>
          {/* Left Side - Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={imageUrl || "https://github.com/shadcn.png"}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Change Button */}
            <button 
              onClick={onChangeArtist}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change
            </button>
          </div>

          {/* Right Side - Artist Info */}
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{name}</h2>
              <div className="flex items-center gap-2">
                <img 
                  src={`/flags/${countryCode.toLowerCase()}.svg`}
                  alt={country}
                  className="w-5 h-3"
                />
                <span className="text-gray-600">{country}</span>
              </div>
            </div>

            {/* Genre Rankings */}
            <div className="space-y-2">
              {Object.entries(rankings).map(([genre, rank]) => (
                genre !== 'overall' && (
                  <div key={genre} className="flex justify-between items-center gap-8">
                    <span className="text-gray-600">{genre}</span>
                    <span className="font-semibold">#{rank}</span>
                  </div>
                )
              ))}
            </div>

            {/* Overall Rank */}
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{rankings.overall}</span>
              {overallRankChange && (
                <span className={`text-sm ${overallRankChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {overallRankChange > 0 ? '+' : ''}{overallRankChange}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 