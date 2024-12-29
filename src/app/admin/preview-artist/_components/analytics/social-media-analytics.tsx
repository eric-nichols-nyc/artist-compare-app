import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Analytics } from "@/types/analytics";
import { useScrapedDataStore } from "@/stores/scraped-data-store";
import { useArtistFormStore } from "@/stores/artist-form-store";

interface SocialMediaAnalyticsProps {
  analytics: Analytics;
}

export function SocialMediaAnalytics({ analytics }: SocialMediaAnalyticsProps) {
  const { socialStats } = useScrapedDataStore();
  const { dispatch } = useArtistFormStore();

  const hasSocialStats = Object.keys(socialStats).length > 0;

  const handleImportSocialStats = () => {
    dispatch({
      type: 'UPDATE_ANALYTICS',
      payload: {
        instagramFollowers: socialStats.instagram,
        facebookFollowers: socialStats.facebook,
        tiktokFollowers: socialStats.tiktok,
        soundcloudFollowers: socialStats.soundcloud,
      }
    });
  };

  const socialPlatforms = [
    { label: 'Instagram', value: analytics?.instagramFollowers },
    { label: 'Facebook', value: analytics?.facebookFollowers },
    { label: 'TikTok', value: analytics?.tiktokFollowers },
    { label: 'SoundCloud', value: analytics?.soundcloudFollowers },
  ];

  return (
    <Card className="p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <p>Social Media Fan base</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportSocialStats}
          disabled={!hasSocialStats}
          className="h-8"
        >
          <Download className="h-4 w-4 mr-2" />
          Import from Viberate
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {socialPlatforms.map((social) => (
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
  );
} 