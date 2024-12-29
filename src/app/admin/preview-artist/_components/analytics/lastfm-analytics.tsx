import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { parseCompactNumber } from "@/lib/utils/number-format";
import { Analytics } from "@/types/analytics";

interface LastFMAnalyticsProps {
  analytics: Analytics;
}

export function LastFMAnalytics({ analytics }: LastFMAnalyticsProps) {
  const stats = [
    {
      label: "Listeners",
      value: parseCompactNumber(analytics.lastfmListeners),
    },
    {
      label: "Play Count",
      value: parseCompactNumber(analytics.lastfmPlayCount),
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