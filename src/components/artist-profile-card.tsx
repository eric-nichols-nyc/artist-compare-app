import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react';

interface ArtistProfileProps {
  name: string
  country: string
  countryCode: string
  genre: string
  imageUrl: string
  rank: number
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
  rank,
  imageUrl,
  rankings,
  overallRankChange,
  onChangeArtist,
  reversed
}: ArtistProfileProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "/images/placeholder.jpg";

  return (
    <Card className={`w-full ${reversed ? 'bg-gray-50' : ''}`}>
      <CardContent className="pt-6">
        <div className={`flex justify-between gap-8 ${reversed ? 'flex-row-reverse' : ''}`}>
          {/* Left Side - Profile Image */}
          <div className="flex flex-col justify-between gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={imageError ? fallbackImage : (imageUrl || fallbackImage)}
                alt={name}
                width={128}
                height={128}
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            </div>
            
            {/* Change Button */}
            <Button 
              variant="outline"
              onClick={onChangeArtist}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change
            </Button>
          </div>

          {/* Right Side - Artist Info */}
          <div className={`flex flex-col gap-4 ${reversed ? 'items-start' : 'items-end'}`}>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{name}</h2>
              <div className={`flex flex-row items-center gap-2 justify-end ${reversed ? 'flex-row-reverse' : ''}`}>
                <span className="text-gray-600">{country}</span>
                <Image 
                  src={`/flags/us.svg`}
                  alt={country}
                  width={20}
                  height={12}
                  className="w-5 h-3"
                />
              </div>
            </div>
            {/* Overall Rank */}
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{rank}</span>
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
  );
} 