import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrapedDataStore } from "@/stores/scraped-data-store";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface ScrapeOptionsPanelProps {
  artistName: string;
  spotifyId: string | null | undefined;
  youtubeChannelId?: string | null;
  variant?: 'default' | 'compact';
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
  youtubeChannelId,
  variant = 'default'
}: ScrapeOptionsPanelProps) {
  const { setViberateSocialStats, setViberateVideos, setViberateTracks, setSocialStats } = useScrapedDataStore();
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
    if (sourceStates.viberate.isLoading) return;

    updateSourceState("viberate", { isLoading: true, error: null });

    try {
      const formattedArtistName = artistName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const response = await fetch(
        `/api/scrape/viberate/social-stats/playwright?artistName=${formattedArtistName}`
      );
      if (!response.ok) throw new Error("Failed to scrape Viberate");

      const data = await response.json();
      console.log('Viberate scraped data:', data);

      if (data.error) throw new Error(data.error);

      // Set all the scraped data
      if (data.socialStats) {
        console.log('Setting social stats:', data.socialStats);
        setViberateSocialStats(data.socialStats);
        setSocialStats(data.socialStats);
      }
      
      if (data.topVideos) {
        console.log('Setting videos:', data.topVideos);
        setViberateVideos(data.topVideos);
      }
      
      if (data.topSongs) {
        console.log('Setting tracks:', data.topSongs);
        setViberateTracks(data.topSongs);
      }

      updateSourceState("viberate", {
        isLoading: false,
        isLoaded: true,
        error: null,
      });
    } catch (error) {
      console.error('Viberate scraping error:', error);
      updateSourceState("viberate", {
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to scrape Viberate",
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

  return variant === 'compact' ? (
    <div className="flex items-center justify-start gap-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleScrapeViberate}
        disabled={sourceStates.viberate.isLoading}
        className="flex items-center gap-2"
      >
        <Image
          src="/images/logo-viberate-new-red-white.svg"
          alt="Viberate"
          width={16}
          height={16}
          className="h-4 w-auto"
        />
        {sourceStates.viberate.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : 'Scrape Viberate'}
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleScrapeSpotify}
        disabled={sourceStates.spotify.isLoading}
        className="flex items-center gap-2"
      >
        <Image
          src="/images/icon-link-spotify-color.f8bf1b4d.svg"
          alt="Spotify"
          width={16}
          height={16}
        />
        {sourceStates.spotify.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : 'Scrape Spotify'}
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleScrapeYoutube}
        disabled={sourceStates.youtube.isLoading}
        className="flex items-center gap-2"
      >
        <Image
          src="/images/youtube-alt.23d934c0.svg"
          alt="YouTube"
          width={16}
          height={16}
        />
        {sourceStates.youtube.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : 'Scrape YouTube'}
      </Button>
    </div>
  ) : (
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
