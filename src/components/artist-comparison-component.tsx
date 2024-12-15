"use client";
import { useState, useEffect } from "react";
import { ArtistComparisonSection } from "./artist-comparison-section";
import { useSearchParams, useRouter } from "next/navigation";

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

interface ArtistComparisonProps {
  reversed?: boolean;
}

export function ArtistComparison({ reversed = false }: ArtistComparisonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const artist1Param = searchParams.get("artist1");
  const artist2Param = searchParams.get("artist2");

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const recommendedArtists = [
    {
      name: "The Neighbourhood",
      country: "USA",
      countryCode: "US",
      genre: "ROCK",
      imageUrl: "/artists/neighbourhood.jpg",
    },
    {
      name: "Conan Gray",
      country: "USA",
      countryCode: "US",
      genre: "POP",
      imageUrl: "/artists/conan-gray.jpg",
    },
  ];

  const billieEilish: Artist = {
    name: "Billie Eilish",
    country: "USA",
    countryCode: "US",
    genre: "POP",
    imageUrl: "https://github.com/shadcn.png",
    rankings: {
      pop: 1,
      mainstreamPop: 1,
      overall: 1,
    },
  };

  const drake: Artist = {
    name: "Drake",
    country: "Canada",
    countryCode: "CA",
    genre: "HIP HOP",
    imageUrl: "https://github.com/shadcn.png",
    rankings: {
      pop: 2,
      mainstreamPop: 3,
      overall: 2,
    },
  };

  const artists = reversed ? [drake, billieEilish] : [billieEilish, drake];

  const handleArtistSelect = (artist: Omit<Artist, "rankings">) => {
    console.log("artist selected", artist);
    if (!artist1Param) {
      router.push(`?artist1=${encodeURIComponent(artist.name)}`);
    } else if (!artist2Param) {
      router.push(
        `?artist1=${encodeURIComponent(
          artist1Param
        )}&artist2=${encodeURIComponent(artist.name)}`
      );
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="bg-gradient-to-r from-purple-700 to-cyan-500 h-48 rounded-lg flex items-center justify-center mb-6">
        <h1 className="text-4xl font-bold text-white">Compare Artists</h1>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ArtistComparisonSection
          id={1}
          artist={artists[0]}
          title="First Artist"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          recommendedArtists={recommendedArtists}
          onArtistSelect={handleArtistSelect}
        />
        <ArtistComparisonSection
          id={2}
          artist={artists[1]}
          title="Second Artist"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          recommendedArtists={recommendedArtists}
          onArtistSelect={handleArtistSelect}
          reversed={true}
        />
      </div>
    </div>
  );
}
