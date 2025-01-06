"use client";
import { useState, useEffect } from "react";
import { ArtistComparisonSection } from "./artist-comparison-section";
import { useSearchParams, useRouter } from "next/navigation";
import { FanbaseChart } from "./features/compare/fanbase-chart";
import { ComparisonSection } from "./features/compare/comparison-section";


const sampleData = [
  {
    name: "Taylor Swift",
    platforms: {
      spotify: 111200000,      // 111.2M Spotify monthly listeners
      youtube: 56400000,       // 56.4M YouTube subscribers
      instagram: 280500000,    // 280.5M Instagram followers
      facebook: 69800000,      // 69.8M Facebook followers
      tiktok: 23400000,       // 23.4M TikTok followers
      twitter: 92700000,       // 92.7M Twitter followers
      deezer: 14300000,       // 14.3M Deezer followers
      soundcloud: 3200000,     // 3.2M SoundCloud followers
      twitch: 450000,         // 450K Twitch followers
      amazon: 8900000,        // 8.9M Amazon Music followers
      applemusic: 38500000,   // 38.5M Apple Music followers
      pandora: 12400000,      // 12.4M Pandora followers
      vk: 890000,            // 890K VK followers
      yandex: 2100000,       // 2.1M Yandex Music followers
    },
    totalFollowers: 727000000  // 727M total
  },
  {
    name: "Sabrina Carpenter",
    platforms: {
      spotify: 38900000,      // 38.9M Spotify monthly listeners
      youtube: 5200000,       // 5.2M YouTube subscribers
      instagram: 30800000,    // 30.8M Instagram followers
      facebook: 2100000,      // 2.1M Facebook followers
      tiktok: 18400000,      // 18.4M TikTok followers
      twitter: 3900000,       // 3.9M Twitter followers
      deezer: 2800000,       // 2.8M Deezer followers
      soundcloud: 890000,     // 890K SoundCloud followers
      twitch: 120000,        // 120K Twitch followers
      amazon: 1900000,       // 1.9M Amazon Music followers
      applemusic: 8900000,   // 8.9M Apple Music followers
      pandora: 3200000,      // 3.2M Pandora followers
      vk: 180000,           // 180K VK followers
      yandex: 450000,       // 450K Yandex Music followers
    },
    totalFollowers: 119000000  // 119M total
  }
];

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

interface ArtistResponse {
  artists: Array<Omit<Artist, "rankings">>;
}

export function ArtistComparison({ reversed = false }: ArtistComparisonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<Array<Omit<Artist, "rankings">>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtists, setSelectedArtists] = useState<{
    artist1: Artist | null;
    artist2: Artist | null;
  }>({
    artist1: null,
    artist2: null,
  });

  // Fetch artists list for the main view
  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/artists");
      if (!response.ok) throw new Error("Failed to fetch artists");
      const data: ArtistResponse = await response.json();
      setArtists(data.artists || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedArtists.artist1) {
      params.set("artist1", selectedArtists.artist1.name);
    } else {
      params.delete("artist1");
    }
    if (selectedArtists.artist2) {
      params.set("artist2", selectedArtists.artist2.name);
    } else {
      params.delete("artist2");
    }
    router.push(`?${params.toString()}`);
  }, [selectedArtists, router]);

  const handleArtistSelect = (
    artist: Omit<Artist, "rankings">,
    sectionId: number
  ) => {
    setSelectedArtists((prev) => ({
      ...prev,
      [`artist${sectionId}`]: {
        ...artist,
        rankings: { pop: 0, mainstreamPop: 0, overall: 0 },
      },
    }));
  };

  const handleRemoveArtist = (sectionId: number) => {
    setSelectedArtists((prev) => ({
      ...prev,
      [`artist${sectionId}`]: null,
    }));
  };

  return (
    <div className="flex-1 p-6">
      <div className="bg-gradient-to-r from-purple-700 to-cyan-500 h-48 rounded-lg flex items-center justify-center mb-6">
        <h1 className="text-4xl font-bold text-white">Compare Artists</h1>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ArtistComparisonSection
          id={1}
          artist={selectedArtists.artist1}
          title="First Artist"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          recommendedArtists={artists}
          onArtistSelect={(artist) => handleArtistSelect(artist, 1)}
          onRemoveArtist={() => handleRemoveArtist(1)}
          isLoading={loading}
        />
        <ArtistComparisonSection
          id={2}
          artist={selectedArtists.artist2}
          title="Second Artist"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          recommendedArtists={artists}
          onArtistSelect={(artist) => handleArtistSelect(artist, 2)}
          onRemoveArtist={() => handleRemoveArtist(2)}
          isLoading={loading}
          reversed={true}
        />
      </div>
      <ComparisonSection />
    </div>
  );
}
