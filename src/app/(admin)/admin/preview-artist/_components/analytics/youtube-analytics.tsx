import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Analytics } from "@/types/analytics";

interface YoutubeAnalyticsProps {
  analytics: Analytics;
  youtubeChannelId?: string;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export function YoutubeAnalytics({ 
  analytics, 
  youtubeChannelId,
  onRefresh,
  isRefreshing 
}: YoutubeAnalyticsProps) {
  const stats = [
    {
      label: "Subscribers",
      value: analytics.youtubeSubscribers,
    },
    {
      label: "Total Views",
      value: analytics.youtubeTotalViews,
    },
  ];

  return (
    <Card className="p-4 bg-red-50">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-medium text-sm">YouTube</h5>
          {youtubeChannelId && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
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