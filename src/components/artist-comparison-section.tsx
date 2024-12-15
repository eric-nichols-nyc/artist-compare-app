"use client";
import { useState, useEffect } from 'react'
import { ArtistProfileCard } from "./artist-profile-card";
import { ArtistListCard } from "./artist-list-card";
import { useSearchParams, useRouter } from 'next/navigation'

interface Artist {
  name: string;
  country: string;
  countryCode: string;
  genre: string;
  imageUrl: string;
  rankings: {
    pop: number;
    mainstreamPop: number;
    overall: number;
  };
}

interface ArtistComparisonSectionProps {
  id: number;
  artist: Artist;
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  recommendedArtists: Array<Omit<Artist, "rankings">>;
  onArtistSelect: (artist: Omit<Artist, "rankings">) => void;
  reversed?: boolean;
}

export function ArtistComparisonSection({
    id,
  artist,
  title,
  searchQuery,
  onSearchChange,
  recommendedArtists,
  onArtistSelect,
  reversed,
}: ArtistComparisonSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [showList, setShowList] = useState(true);


  const handleArtistSelect = (artist: Omit<Artist, "rankings">) => {
    // replace and spaces with -
    const artistName = artist.name.replace(/\s+/g, '-')+'-'+id.toString().toLowerCase();
    // add artist 1 and artist 2 to the query seperately
    onArtistSelect(artist);
    setShowList(false);
  };

  useEffect(() => {
    const query = searchParams.get("query");    
    if (query) {
      console.log(query);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center gap-6">
      {!showList ? (
        <ArtistProfileCard
          {...artist}
          overallRankChange={artist.name === "Travis Scott" ? 2 : 3}
          onChangeArtist={() => {
            setShowList(true);
            console.log(`Change ${artist.name} clicked`);
          }}
          reversed={reversed}
        />
      ) : (
        <ArtistListCard
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          recommendedArtists={recommendedArtists}
          onArtistSelect={handleArtistSelect}
        />
      )}
    </div>
  );
}
