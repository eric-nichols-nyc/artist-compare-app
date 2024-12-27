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
import { HeaderSkeleton } from "./skeletons";
import { RefreshCw } from "lucide-react";

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const { state, dispatch } = useArtistForm();

  const handleSubmitArtist = async (state: any) => {
    try {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      const result = await validateForm(state);
      console.log("result", result);
    } catch (error) {
      console.error("Error validating form", error);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };
  return (
    <>
      <Card className="flex gap-3 relative p-4">
        <div className="flex-grow">
          <ArtistHeader artist={artist} />
          <Suspense fallback={<HeaderSkeleton />}>
            <ArtistDetails artist={artist} />
          </Suspense>
          <Suspense fallback={<HeaderSkeleton />}>
            <ArtistVideos artist={artist} />
          </Suspense>
        </div>
        <div className="flex-grow">
          <Suspense fallback={<HeaderSkeleton />}>
            <ArtistTracks artist={artist} />
          </Suspense>
          <ArtistAnalytics />
          <Suspense fallback={<HeaderSkeleton />}>
            <SimilarArtists artist={artist} />
          </Suspense>
        </div>
      </Card>
      <Button 
        onClick={() => handleSubmitArtist(state)}
        className="w-full mt-4 py-6 text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors"
        disabled={state.isSubmitting}
      >
        {state.isSubmitting ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Artist'
        )}
      </Button>
    </>
  );
}
