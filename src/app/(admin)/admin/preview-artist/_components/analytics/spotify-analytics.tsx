import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Analytics } from "@/types/analytics";
import { useScrapedDataStore } from "@/stores/scraped-data-store";
import { parseCompactNumber } from "@/lib/utils/number-format";
import { useArtistFormStore } from "@/stores/artist-form-store";


export function SpotifyAnalytics() {
  const { spotifyTracks } = useScrapedDataStore();
  const { dispatch, analytics } = useArtistFormStore();

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "N/A";
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num).toString();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: keyof Analytics) => {
    const value = parseCompactNumber(e.target.value);
    if (value !== null) {
      dispatch({
        type: 'UPDATE_ANALYTICS',
        payload: { [field]: value }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Analytics) => {        
    const value = parseCompactNumber(e.target.value);
    if (value !== null) {
      dispatch({
        type: 'UPDATE_ANALYTICS',
        payload: { [field]: value }
      });
    }
  };

  const handleImportMonthlyListeners = () => {
    if (spotifyTracks.length > 0) {
      // Assuming the first track has the most recent monthly listeners
      const monthlyListeners = spotifyTracks[0].spotifyStreams;
      if (monthlyListeners) {
        dispatch({
          type: 'UPDATE_ANALYTICS',
          payload: { spotifyMonthlyListeners: monthlyListeners}
        });
      }
    }
  };

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
          onClick={handleImportMonthlyListeners}
          className="h-8 px-2"
        >
          Import
        </Button>
      )
    },
  ];

  return (
    <Card className="p-4 bg-green-50">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-medium text-sm">Spotify</h5>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>
    </Card>
  );
} 