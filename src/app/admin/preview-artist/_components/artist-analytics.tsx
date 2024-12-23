"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SpotifyArtist } from "@/types/api";
import { useArtistForm } from "@/providers/artist-form-provider";

interface ArtistAnalyticsProps {
  artist: SpotifyArtist;
}

export function ArtistAnalytics({ artist }: ArtistAnalyticsProps) {
  const { state, dispatch } = useArtistForm();
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "N/A";
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!state.analytics) {
    return <div className="p-4">No analytics available</div>;
  }

  const platforms = [
    {
      name: "Spotify",
      stats: [
        {
          label: "Followers",
          value: formatNumber(state.analytics.spotifyFollowers),
        },
        {
          label: "Popularity",
          value: state.analytics.spotifyPopularity || "N/A",
        },
        {
          label: "Monthly Listeners",
          value: state.analytics.spotifyMonthlyListeners || "N/A",
        },
      ],
      bgColor: "bg-green-50",
    },
    {
      name: "YouTube",
      stats: [
        {
          label: "Subscribers",
          value: formatNumber(state.analytics.youtubeSubscribers),
        },
        {
          label: "Total Views",
          value: formatNumber(state.analytics.youtubeTotalViews),
        },
      ],
      bgColor: "bg-red-50",
    },
    {
      name: "Last.fm",
      stats: [
        {
          label: "Listeners",
          value: formatNumber(state.analytics.lastfmListeners),
        },
        {
          label: "Play Count",
          value: formatNumber(state.analytics.lastfmPlayCount),
        },
      ],
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-3">Platform Analytics</h4>
      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.name} className={`p-4 ${platform.bgColor}`}>
            <div className="flex flex-col">
              <h5 className="font-medium text-sm mb-2">{platform.name}</h5>
              <div className="grid grid-cols-2 gap-4">
                {platform.stats.map((stat) => (
                  <div key={stat.label} className="text-sm">
                    <div className="text-gray-600">{stat.label}</div>
                    <div className="font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="flex gap-4 p-4 mt-4 justify-between">
        <div className="text-xs text-gray-500">
          instagram: {state.analytics.instagramFollowers || "N/A"}
        </div>
        <div className="text-xs text-gray-500">
          facebook: {state.analytics.facebookFollowers || "N/A"}
        </div>
        <div className="text-xs text-gray-500">
          tiktok: {state.analytics.tiktokFollowers || "N/A"}
        </div>
        <div className="text-xs text-gray-500">
          soundcloud: {state.analytics.soundcloudFollowers || "N/A"}
        </div>
      </Card>
    </div>
  );
}
