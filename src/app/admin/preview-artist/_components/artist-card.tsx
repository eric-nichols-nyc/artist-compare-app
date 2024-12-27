import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { SpotifyArtist } from "@/types";
import { Button } from "@/components/ui/button";
import { ArtistHeader } from "./artist-header";
import { ArtistDetails } from "./artist-details";
import { ArtistTracks } from "./artist-tracks";
import { ArtistVideos } from "./artist-videos";
import { ArtistAnalytics } from "./artist-analytics";
import { SimilarArtists } from "./similar-artists";
import { useArtistForm, validateForm } from "@/providers/artist-form-provider";

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
    const { state, dispatch } = useArtistForm();

    const handleSubmitArtist = async (state:any) => {
        try {   
            dispatch({ type: 'SET_SUBMITTING', payload: true });
            const result = await validateForm(state);
            console.log("result", result);
        } catch (error) {
            console.error("Error validating form", error);
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
      }
  return (
    <>
      <Card className="relative p-4">
        <ArtistHeader artist={artist} />
        <Suspense fallback={<div className="p-4">Loading artist details...</div>}>
          <ArtistDetails artist={artist} />
        </Suspense>
        <Suspense fallback={<div className="p-4">Loading videos...</div>}>
          <ArtistVideos artist={artist} />
        </Suspense>
        <Suspense fallback={<div className="p-4">Loading tracks...</div>}>
          <ArtistTracks artist={artist} />
        </Suspense>
        <ArtistAnalytics />
        <Suspense fallback={<div className="p-4">Loading similar artists...</div>}>
          <SimilarArtists artist={artist} />
        </Suspense>
      </Card>
      <Button onClick={() => handleSubmitArtist(state)}>Submit</Button>
    </>
  );
} 