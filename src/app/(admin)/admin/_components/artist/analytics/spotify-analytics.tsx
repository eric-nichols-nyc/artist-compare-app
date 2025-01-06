import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Analytics } from "@/types/analytics";
import { useScrapedDataStore } from "@/stores/scraped-data-store";
import { useAnalyticsState } from "@/hooks/useAnalyticsState";
import { BaseAnalytics } from "./base-analytics";

export function SpotifyAnalytics() {
  const { spotifyTracks } = useScrapedDataStore();
  const { analytics, formatNumber, handleBlur, handleChange } = useAnalyticsState();


  const stats = [
    {
      label: "Followers",
      value: formatNumber(analytics.spotifyFollowers),
      field: "spotifyFollowers" as keyof Analytics,
      editable: true
    },
    {
      label: "Popularity",
      value: analytics.spotifyPopularity || "N/A",
      field: "spotifyPopularity" as keyof Analytics,
      editable: false
    },
    {
      label: "Monthly Listeners",
      value: analytics.spotifyMonthlyListeners || "N/A",
      field: "spotifyMonthlyListeners" as keyof Analytics,
      editable: true,
      action: spotifyTracks.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => alert('Import')}
          className="h-8 px-2"
        >
          Import
        </Button>
      )
    },
  ];

  return (
    <BaseAnalytics title="Spotify" bgColor="bg-green-50">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-1">
          <Label>{stat.label}</Label>
          <div className="flex gap-2">
            <Input 
              defaultValue={stat.value}
              readOnly={!stat.editable}
              className="bg-white/50"
              onChange={(e) => handleChange(e, stat.field)}
              onBlur={stat.editable ? (e) => handleBlur(e, stat.field) : undefined}
            />
            {stat.action}
          </div>
        </div>
      ))}
    </BaseAnalytics>
  );
} 