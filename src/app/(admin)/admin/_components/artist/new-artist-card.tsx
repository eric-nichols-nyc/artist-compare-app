import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SpotifyArtist } from "@/types";
import { Button } from "@/components/ui/button";
import { ArtistHeader } from "./artist-header";
import { ArtistTracks } from "./artist-tracks";
import { ArtistVideos } from "./artist-videos";
import { ArtistAnalytics } from "./artist-analytics";
import { HeaderSkeleton } from "./skeletons";
import { RefreshCw, X } from "lucide-react";
import { StoreInspector } from '@/components/store-inspector'
import { useStoreDebug } from '@/hooks/use-store-debug'
import { useArtistFormStore } from "@/stores/artist-form-store";
import { DockableArtistHeader } from "./dockable-artist-header";
import { ScrapeOptionsPanel } from '@/components/scrape-options-panel'

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const isSubmitting = useArtistFormStore(state => state.isSubmitting)
  const {dispatch, submitArtist, errors} = useArtistFormStore(state => state)
  const[errorMessages, setErrorMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    console.log('errors', errors)
  }, [errors])

  // Only enable in development
  if (process.env.NODE_ENV === 'development') {
    useStoreDebug()
  }

  const handleSubmitArtist = async () => {
    try {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      const submit = await submitArtist();
      console.log('submit ', submit)

     
      
      // Clear the form or redirect
      dispatch({ type: "CANCEL_ARTIST_SELECTION" });

    } catch (error) {
      console.error("Error submitting form", error);
      setErrorMessages(error as Record<string, string>)
      // Handle error (show toast notification, etc.)
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const handleCancel = () => {
    dispatch({ type: "CANCEL_ARTIST_SELECTION" });
  };

  return (
    <>
      <DockableArtistHeader artist={artist} />
      <Card className="flex flex-col gap-3 relative p-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow">
          <ArtistHeader artist={artist} />
        </div>
        <ScrapeOptionsPanel 
            artistName={artist.name}
            spotifyId={artist.spotifyId}
            youtubeChannelId={artist.youtubeChannelId}
            variant="compact"
          />        
          <div className="grid grid-cols-2 gap-3">
          <Suspense fallback={<HeaderSkeleton />}>
            <ArtistVideos />
          </Suspense>
          <Suspense fallback={<HeaderSkeleton />}>
            <ArtistTracks artist={artist} />
          </Suspense>
        </div>
        <div className="flex-grow">
          <ArtistAnalytics />
        </div> 
      </Card>
      {
        errorMessages && (<p className="text-red-500">Form is not valid</p>)
      }
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline"
          onClick={handleCancel}
          className="flex-1 py-6 text-lg font-semibold"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmitArtist}
          className="flex-1 py-6 text-lg font-semibold bg-green-600 hover:bg-green-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Artist'
          )}
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && <StoreInspector />}
    </>
  );
}
