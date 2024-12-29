"use client";

import { useState } from "react";
import { useArtistFormStore } from "@/stores/artist-form-store";
import { SpotifyAnalytics } from "./analytics/spotify-analytics";
import { YoutubeAnalytics } from "./analytics/youtube-analytics";
import { LastFMAnalytics } from "./analytics/lastfm-analytics";
import { SocialMediaAnalytics } from "./analytics/social-media-analytics";

export function ArtistAnalytics() {
  const { analytics, artistInfo, refreshYoutubeAnalytics } = useArtistFormStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshYoutube = async () => {
    if (!artistInfo.youtubeChannelId) return;
    
    setIsRefreshing(true);
    try {
      await refreshYoutubeAnalytics(artistInfo.youtubeChannelId);
    } catch (error) {
      setError('Failed to refresh YouTube analytics');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!analytics) {
    return <div className="p-4">No analytics available</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Platform Analytics</h4>
      <div className="grid grid-cols-3 gap-4">
        <SpotifyAnalytics analytics={analytics} />
        <YoutubeAnalytics 
          analytics={analytics}
          youtubeChannelId={artistInfo.youtubeChannelId}
          onRefresh={handleRefreshYoutube}
          isRefreshing={isRefreshing}
        />
        <LastFMAnalytics analytics={analytics} />
      </div>
      <SocialMediaAnalytics analytics={analytics} />
    </div>
  );
}
