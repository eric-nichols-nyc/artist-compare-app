"use client";

import { SpotifyArtist } from "@/types";
import {
  ArtistFormProvider,
} from "@/providers/artist-form-provider";
import { ArtistCard } from "./new-artist-card";

interface SearchedhArtistProps {
  selectedArtists: SpotifyArtist[];
  onRemoveArtist?: (spotifyId: string) => void;
}

export function SelectedArtists({
  selectedArtists,
}: SearchedhArtistProps) {



  return (
    <ArtistFormProvider>
      <div className="grid grid-cols-1 gap-4 mt-6">
        {selectedArtists.map((artist) => (
          <div key={artist.spotifyId}>
            <ArtistCard 
              artist={artist}
            />
          </div>
        ))}
      </div>
    </ArtistFormProvider>
  );
}
