import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SpotifyArtist } from "@/types"
import { useMemo } from "react"

interface SocialLinksProps {
  artist: SpotifyArtist
  onChange?: (links: { platform: string; url: string }[]) => void
  editable?: boolean
}

const SOCIAL_PLATFORMS = [
  { platform: 'Website', urlTemplate: 'https://{handle}.com' },
  { platform: 'Spotify', urlTemplate: 'https://open.spotify.com/artist/{id}' },
  { platform: 'Instagram', urlTemplate: 'https://instagram.com/{handle}' },
  { platform: 'YouTube', urlTemplate: 'https://youtube.com/@{handle}' },
  { platform: 'TikTok', urlTemplate: 'https://tiktok.com/@{handle}' },
  { platform: 'Facebook', urlTemplate: 'https://facebook.com/{handle}' },
]

export const SocialLinks = ({ artist, onChange }: SocialLinksProps) => {
  const defaultLinks = useMemo(() => {
    const handle = artist.name.toLowerCase().replace(/\s+/g, '')
    
    return SOCIAL_PLATFORMS.map(({ platform, urlTemplate }) => ({
      platform,
      url: platform === 'Spotify' 
        ? urlTemplate.replace('{id}', artist.id)
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

  return (
    <div className="grid grid-cols-2 gap-4">
      {defaultLinks.map((link) => (
        <div key={link.platform} className="space-y-2">
          <Label htmlFor={`${link.platform}-url`}>{link.platform}</Label>
            <Input
              id={`${link.platform}-url`}
              value={link.url}
              onChange={(e) => handleUrlChange(link.platform, e.target.value)}
              placeholder={`Enter ${link.platform} URL`}
              className="max-w-md"
            />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              {link.url}
            </a>
          
        </div>
      ))}
    </div>
  )
}