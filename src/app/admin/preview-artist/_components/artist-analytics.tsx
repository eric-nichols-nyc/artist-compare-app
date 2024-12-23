"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SpotifyArtist } from "@/types/api";
import { useArtistForm } from "@/providers/artist-form-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
                  <div key={stat.label} className="space-y-1">
                    <Label>{stat.label}</Label>
                    <Input 
                      value={stat.value}
                      readOnly
                      className="bg-white/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Instagram', value: state.analytics?.instagramFollowers },
            { label: 'Facebook', value: state.analytics?.facebookFollowers },
            { label: 'TikTok', value: state.analytics?.tiktokFollowers },
            { label: 'SoundCloud', value: state.analytics?.soundcloudFollowers },
          ].map((social) => (
            <div key={social.label} className="space-y-1">
              <Label>{social.label}</Label>
              <Input 
                value={social.value || 'N/A'}
                readOnly
                className="bg-gray-50 text-sm"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
