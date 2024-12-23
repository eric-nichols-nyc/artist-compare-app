"use client";

import { useState } from "react";
import { ArtistSearch } from "./_components/artist-search";
import { SelectedArtists } from "./_components/selected-artists";
import { ArtistFormProvider } from "@/providers/artist-form-provider";
interface Artist {
  name: string;
  spotifyId: string;
  imageUrl?: string;
}

export default function PreviewArtistPage() {
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

  const handleArtistSelect = (artist: Artist) => {
    console.log("artist", artist);
    setSelectedArtists([...selectedArtists, artist]);
  };

  const handleRemoveArtist = (spotifyId: string) => {
    setSelectedArtists(
      selectedArtists.filter((a) => a.spotifyId !== spotifyId)
    );
  };

  return (
    <div className="container mx-auto p-6">
      <ArtistFormProvider>
        <ArtistSearch onArtistSelect={handleArtistSelect} />
        <SelectedArtists
          selectedArtists={selectedArtists}
          onRemoveArtist={handleRemoveArtist}
        />
      </ArtistFormProvider>
    </div>
  );
}
