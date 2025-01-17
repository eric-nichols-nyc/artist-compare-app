import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArtistInfo } from "@/validations/artist-schema"
import { useEffect, useMemo } from "react"
import { 
  Globe, 
  Instagram, 
  Youtube, 
  Facebook,
  ExternalLink 
} from "lucide-react"
import { useArtistFormStore } from "@/stores/artist-form-store"

interface SocialLinksProps {
  artist: ArtistInfo
  onChange?: (links: { platform: string; url: string }[]) => void
  editable?: boolean
}

const SOCIAL_PLATFORMS = [
  { 
    platform: 'Website', 
    urlTemplate: 'https://{handle}.com',
    icon: Globe
  },
  { 
    platform: 'Spotify', 
    urlTemplate: 'https://open.spotify.com/artist/{id}',
    icon: ExternalLink
  },
  { 
    platform: 'Instagram', 
    urlTemplate: 'https://instagram.com/{handle}',
    icon: Instagram
  },
  { 
    platform: 'YouTube', 
    urlTemplate: 'https://youtube.com/@{handle}',
    icon: Youtube
  },
  { 
    platform: 'TikTok', 
    urlTemplate: 'https://tiktok.com/@{handle}',
    icon: ExternalLink // Using generic icon for TikTok as it's not in Lucide
  },
  { 
    platform: 'Facebook', 
    urlTemplate: 'https://facebook.com/{handle}',
    icon: Facebook
  },
  { 
    platform: 'Viberate', 
    urlTemplate: 'https://www.viberate.com/artist/{handle}',
    icon: Facebook
  },
]

export const SocialLinks = ({ artist, onChange }: SocialLinksProps) => {
  const {dispatch} = useArtistFormStore()
  const defaultLinks = useMemo(() => {
    const handle = artist.name.toLowerCase().replace(/\s+/g, '')

    return SOCIAL_PLATFORMS.map(({ platform, urlTemplate }) => ({
      platform,
      url: platform === 'Spotify' 
        ? urlTemplate.replace('{id}', artist.spotifyId || '')
        : urlTemplate.replace('{handle}', handle)
    }))
  }, [artist])

  const handleUrlChange = (platform: string, newUrl: string) => {
    if (!onChange) return

    const updatedLinks = defaultLinks.map(link => 
      link.platform === platform ? { ...link, url: newUrl } : link
    )
    onChange(updatedLinks)
  }

  useEffect(() => {
    console.log('defaultLinks', defaultLinks)
    dispatch({
      type: 'UPDATE_ARTIST_INFO',
      payload: {
        instagramUrl: defaultLinks.find(link => link.platform === 'Instagram')?.url,
        youtubeUrl: defaultLinks.find(link => link.platform === 'YouTube')?.url,
        spotifyUrl: defaultLinks.find(link => link.platform === 'Spotify')?.url,
        tiktokUrl: defaultLinks.find(link => link.platform === 'TikTok')?.url,
        facebookUrl: defaultLinks.find(link => link.platform === 'Facebook')?.url,
        websiteUrl: defaultLinks.find(link => link.platform === 'Website')?.url,
        viberateUrl: defaultLinks.find(link => link.platform === 'Viberate')?.url,
      }
    })
  }, [defaultLinks, dispatch])

  return (
    <div className="grid grid-cols-1 gap-4">
      {defaultLinks.map((link) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.platform === link.platform)
        const Icon = platform?.icon || ExternalLink

        return (
          <div key={link.platform} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${link.platform}-url`}>{link.platform}</Label>
            <Input
              id={`${link.platform}-url`}
              value={link.url}
              onChange={(e) => handleUrlChange(link.platform, e.target.value)}
              placeholder={`Enter ${link.platform} URL`}
              className="max-w-md"
            />
                  <Button
                size="icon"
                variant="ghost"
                asChild
                className="h-8 w-8"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${link.platform} link`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              </Button>
          </div>
          </div>
        )
      })}
    </div>
  )
}