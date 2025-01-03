import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Analytics } from "@/types/analytics";
import { useAnalyticsState } from "@/hooks/useAnalyticsState";
import { BaseAnalytics } from "./base-analytics";

export function LastFMAnalytics() {
  const { analytics, handleBlur, handleChange } = useAnalyticsState();

  const stats = [
    {
      label: "Monthly Listeners",
      value: analytics.lastFmMonthlyListeners,
      field: "lastFmMonthlyListeners" as keyof Analytics,
      editable: true
    },
    {
      label: "Total Listeners",
      value: analytics.lastfmListeners,
      field: "lastfmListeners" as keyof Analytics,
      editable: true
    },
    {
      label: "Play Count",
      value: analytics.lastfmPlayCount,
      field: "lastfmPlayCount" as keyof Analytics,
      editable: true
    },
  ];

  return (
    <BaseAnalytics title="Last.fm" bgColor="bg-blue-50">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-1">
          <Label>{stat.label}</Label>
          <Input 
            defaultValue={stat.value || 'N/A'}
            className="bg-white/50"
            onChange={(e) => handleChange(e, stat.field)}
            onBlur={(e) => handleBlur(e, stat.field)}
          />
        </div>
      ))}
    </BaseAnalytics>
  );
} 