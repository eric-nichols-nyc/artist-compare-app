import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArtistAnalytics } from "@/validations/artist-schema";

interface LastFMAnalyticsProps {
  analytics: ArtistAnalytics;
}

export function LastFMAnalytics({ analytics }: LastFMAnalyticsProps) {
  const stats = [
    {
      label: "Monthly Listeners",
      value: analytics.lastFmMonthlyListeners,
    },
    {
      label: "Total Listeners",
      value: analytics.lastfmListeners,
    },
    {
      label: "Play Count",
      value: analytics.lastfmPlayCount
    },
  ];

  return (
    <Card className="p-4 bg-blue-50">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-medium text-sm">Last.fm</h5>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
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
  );
} 