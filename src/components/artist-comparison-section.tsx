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
  artist: Artist | null;
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  recommendedArtists: Array<Omit<Artist, "rankings">>;
  onArtistSelect: (artist: Omit<Artist, "rankings">) => void;
  onRemoveArtist: () => void;
  isLoading?: boolean;
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
  onRemoveArtist,
  isLoading,
  reversed,
}: ArtistComparisonSectionProps) {
  console.log('artist comparison section', artist)
  const handleArtistSelect = (selectedArtist: Omit<Artist, "rankings">) => {
    onArtistSelect(selectedArtist);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full px-6">
      {artist ? (
        <ArtistProfileCard
          {...artist}
          overallRankChange={3}
          onChangeArtist={() => {
            onRemoveArtist();
          }}
          reversed={reversed}
        />
      ) : (
        <ArtistListCard
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          recommendedArtists={recommendedArtists}
          onArtistSelect={handleArtistSelect}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
