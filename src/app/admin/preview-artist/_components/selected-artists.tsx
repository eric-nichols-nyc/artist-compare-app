"use client";

import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { SpotifyArtist } from "@/types";
import { ArtistDetails } from "./artist-details";
import { ArtistTracks } from "./artist-tracks";
import { SimilarArtists } from "./similar-artists";
import { ArtistAnalytics } from "./artist-analytics";
import { ArtistVideos } from "./artist-videos";
import {
  ArtistFormProvider,
} from "@/providers/artist-form-provider";
import { ArtistHeader } from "./artist-header";
import { Button } from "@/components/ui/button";
import { useArtistForm } from "@/providers/artist-form-provider";
import { ArtistFormState } from "@/types";
import { validateForm } from "@/providers/artist-form-provider";

interface SearchedhArtistProps {
  selectedArtists: SpotifyArtist[];
  onRemoveArtist: (spotifyId: string) => void;
}

export function SelectedArtists({
  selectedArtists,
  onRemoveArtist,
}: SearchedhArtistProps) {

  const { state, dispatch } = useArtistForm();


  const handleSubmitArtist = async() => {
    const result = await validateForm(state);
    console.log("result", result);
  }


  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {selectedArtists.map((artist) => (
        <ArtistFormProvider>
          <Card key={artist.spotifyId} className="relative p-4">
            {/* Header Section */}
            <ArtistHeader artist={artist} />
            {/* Artist Details Section */}
            <Suspense
              fallback={<div className="p-4">Loading artist details...</div>}
            >
              <ArtistDetails artist={artist} />
            </Suspense>
            <Suspense fallback={<div className="p-4">Loading videos...</div>}>
              <ArtistVideos artist={artist} />
            </Suspense>

            <Suspense fallback={<div className="p-4">Loading tracks...</div>}>
              <ArtistTracks artist={artist} />
            </Suspense>
            <ArtistAnalytics />
            <Suspense
              fallback={<div className="p-4">Loading similar artists...</div>}
            >
              <SimilarArtists artist={artist} />
            </Suspense>
          </Card>
          <Button onClick={() => handleSubmitArtist(artist)}>Submit</Button>
        </ArtistFormProvider>
      ))}
    </div>
  );
}
