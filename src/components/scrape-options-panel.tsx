import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { useScrapedDataStore } from "@/stores/scraped-data-store";
import { useArtistFormStore } from "@/stores/artist-form-store";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScrapeOptionsPanelProps {
  artistName: string;
  spotifyId?: string | null;
  youtubeChannelId?: string | null;
}

type Source = "viberate" | "spotify" | "youtube";

interface SourceState {
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;
}

export function ScrapeOptionsPanel({
  artistName,
  spotifyId,
}: ScrapeOptionsPanelProps) {
  const { artistInfo } = useArtistFormStore();
  const youtubeChannelId = artistInfo.youtubeChannelId;
  const [sourceStates, setSourceStates] = useState<Record<Source, SourceState>>(
    {
      viberate: { isLoading: false, error: null, isLoaded: false },
      spotify: { isLoading: false, error: null, isLoaded: false },
      youtube: { isLoading: false, error: null, isLoaded: false },
    }
  );

  const updateSourceState = (source: Source, updates: Partial<SourceState>) => {
    setSourceStates((prev) => ({
      ...prev,
      [source]: { ...prev[source], ...updates },
    }));
  };

  const handleScrapeViberate = async () => {
    if (sourceStates.viberate.isLoading || sourceStates.viberate.isLoaded)
      return;

    updateSourceState("viberate", { isLoading: true, error: null });

    try {
      const response = await fetch(
        `/api/scrape/viberate/social-stats/playwright?artistName=${encodeURIComponent(
          artistName
        )}`
      );
      if (!response.ok) throw new Error("Failed to scrape Viberate");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      updateSourceState("viberate", {
        isLoading: false,
        isLoaded: true,
        error: null,
      });
    } catch (error) {
      updateSourceState("viberate", {
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to scrape Viberate",
      });
    }
  };

  const handleScrapeSpotify = async () => {
    if (!spotifyId) {
      updateSourceState("spotify", { error: "No Spotify ID provided" });
      return;
    }
    if (sourceStates.spotify.isLoading || sourceStates.spotify.isLoaded) return;

    updateSourceState("spotify", { isLoading: true, error: null });

    try {
      const response = await fetch(
        `/api/scrape/spotify/popular-tracks?spotifyId=${spotifyId}`
      );
      if (!response.ok) throw new Error("Failed to fetch Spotify data");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      updateSourceState("spotify", {
        isLoading: false,
        isLoaded: true,
        error: null,
      });
    } catch (error) {
      updateSourceState("spotify", {
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Spotify data",
      });
    }
  };

  const handleScrapeYoutube = async () => {
    if (!youtubeChannelId) {
      updateSourceState("youtube", { error: "No YouTube channel ID provided" });
      return;
    }
    if (sourceStates.youtube.isLoading || sourceStates.youtube.isLoaded) return;

    updateSourceState("youtube", { isLoading: true, error: null });

    try {
      const response = await fetch(
        `/api/admin/artist-videos?channelId=${youtubeChannelId}`
      );
      if (!response.ok) throw new Error("Failed to fetch YouTube data");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      updateSourceState("youtube", {
        isLoading: false,
        isLoaded: true,
        error: null,
      });
    } catch (error) {
      updateSourceState("youtube", {
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch YouTube data",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={sourceStates.viberate.isLoaded ? "secondary" : "default"}
          onClick={handleScrapeViberate}
          disabled={
            sourceStates.viberate.isLoading || sourceStates.viberate.isLoaded
          }
        >
          {sourceStates.viberate.isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : sourceStates.viberate.isLoaded ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : null}
          Scrape Viberate
        </Button>

        <Button
          variant={sourceStates.spotify.isLoaded ? "secondary" : "default"}
          onClick={handleScrapeSpotify}
          disabled={
            !spotifyId ||
            sourceStates.spotify.isLoading ||
            sourceStates.spotify.isLoaded
          }
        >
          {sourceStates.spotify.isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : sourceStates.spotify.isLoaded ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : null}
          Scrape Spotify
        </Button>

        <Button
          variant={sourceStates.youtube.isLoaded ? "secondary" : "default"}
          onClick={handleScrapeYoutube}
          disabled={
            !youtubeChannelId ||
            sourceStates.youtube.isLoading ||
            sourceStates.youtube.isLoaded
          }
        >
          {sourceStates.youtube.isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : sourceStates.youtube.isLoaded ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : null}
          Scrape YouTube
        </Button>
      </div>

      {/* Error messages */}
      {Object.entries(sourceStates).map(
        ([source, state]) =>
          state.error && (
            <Alert variant="destructive" key={source}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {`${source.charAt(0).toUpperCase() + source.slice(1)}: ${
                  state.error
                }`}
              </AlertDescription>
            </Alert>
          )
      )}
    </div>
  );
}
