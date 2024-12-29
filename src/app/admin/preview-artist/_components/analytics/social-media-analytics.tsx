import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Instagram, Facebook, Music2 } from "lucide-react";
import { Analytics } from "@/types/analytics";
import { useScrapedDataStore } from "@/stores/scraped-data-store";
import { useArtistFormStore } from "@/stores/artist-form-store";

// Custom TikTok icon component
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

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
    { 
      label: 'Instagram', 
      value: analytics?.instagramFollowers,
      icon: Instagram,
      className: 'text-pink-500'
    },
    { 
      label: 'Facebook', 
      value: analytics?.facebookFollowers,
      icon: Facebook,
      className: 'text-blue-600'
    },
    { 
      label: 'TikTok', 
      value: analytics?.tiktokFollowers,
      icon: TikTokIcon,
      className: 'text-gray-800'
    },
    { 
      label: 'SoundCloud', 
      value: analytics?.soundcloudFollowers,
      icon: Music2,
      className: 'text-orange-500'
    },
  ];

  return (
    <Card className="p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <p className="font-medium">Social Media Fan base</p>
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
        {socialPlatforms.map((social) => {
          const Icon = social.icon;
          return (
            <div key={social.label} className="space-y-2">
              <Label className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${social.className}`} />
                {social.label}
              </Label>
              <Input 
                value={social.value || 'N/A'}
                readOnly
                className="bg-gray-50 text-sm"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
} 