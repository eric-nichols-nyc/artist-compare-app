"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useArtistFormStore } from "@/stores/artist-form-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { parseCompactNumber } from "@/lib/utils/number-format";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "N/A";
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num).toString();
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!analytics) {
    return <div className="p-4">No analytics available</div>;
  }

  const platforms = [
    {
      name: "Spotify",
      stats: [
        {
          label: "Followers",
          value: formatNumber(analytics.spotifyFollowers),
        },
        {
          label: "Popularity",
          value: analytics.spotifyPopularity || "N/A",
        },
        {
          label: "Monthly Listeners",
          value: analytics.spotifyMonthlyListeners || "N/A",
        },
      ],
      bgColor: "bg-green-50",
    },
    {
      name: "YouTube",
      stats: [
        {
          label: "Subscribers",
          value: parseCompactNumber(analytics.youtubeSubscribers),
        },
        {
          label: "Total Views",
          value: parseCompactNumber(analytics.youtubeTotalViews),
        },
      ],
      bgColor: "bg-red-50",
      action: artistInfo.youtubeChannelId && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefreshYoutube}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      ),
    },
    {
      name: "Last.fm",
      stats: [
        {
          label: "Listeners",
          value: parseCompactNumber(analytics.lastfmListeners),
        },
        {
          label: "Play Count",
          value: parseCompactNumber(analytics.lastfmPlayCount),
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
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium text-sm">{platform.name}</h5>
                {platform.action}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {platform.stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <Label>{stat.label}</Label>
                    <Input 
                      value={stat.value || 'N/A'}
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
        <p>Social Media Fan base</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Instagram', value: analytics?.instagramFollowers },
            { label: 'Facebook', value: analytics?.facebookFollowers },
            { label: 'TikTok', value: analytics?.tiktokFollowers },
            { label: 'SoundCloud', value: analytics?.soundcloudFollowers },
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
