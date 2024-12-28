import { Button } from '@/components/ui/button'
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { useArtistForm } from '@/providers/artist-form-provider'

interface DataSourceSelectorProps {
  type: 'videos' | 'tracks'
}

export function DataSourceSelector({ type }: DataSourceSelectorProps) {
  const { youtubeVideos, spotifyTracks, viberateVideos, viberateTracks } = useScrapedDataStore()
  const { form } = useArtistForm()

  const handleLoadSource = (source: 'youtube' | 'spotify' | 'viberate') => {
    if (type === 'videos') {
      const videos = source === 'youtube' ? youtubeVideos : viberateVideos
      form.setValue('youtubeVideos', videos)
    } else {
      const tracks = source === 'spotify' ? spotifyTracks : viberateTracks
      form.setValue('spotifyTracks', tracks)
    }
  }

  const handleClear = () => {
    if (type === 'videos') {
      form.setValue('youtubeVideos', [])
    } else {
      form.setValue('spotifyTracks', [])
    }
  }

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" onClick={handleClear}>
        Clear
      </Button>
      {type === 'videos' && (
        <>
          <Button 
            variant="outline" 
            onClick={() => handleLoadSource('youtube')}
            disabled={!youtubeVideos.length}
          >
            Load from YouTube
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleLoadSource('viberate')}
            disabled={!viberateVideos.length}
          >
            Load from Viberate
          </Button>
        </>
      )}
      {type === 'tracks' && (
        <>
          <Button 
            variant="outline" 
            onClick={() => handleLoadSource('spotify')}
            disabled={!spotifyTracks.length}
          >
            Load from Spotify
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleLoadSource('viberate')}
            disabled={!viberateTracks.length}
          >
            Load from Viberate
          </Button>
        </>
      )}
    </div>
  )
} 