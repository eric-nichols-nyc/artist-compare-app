import { Button } from '@/components/ui/button'
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { JsonInputDialog } from './json-input-dialog'
import { YoutubeVideoInfo } from '@/validations/artist-schema'

interface DataSourceSelectorProps {
  type: 'videos' | 'tracks'
}

export function DataSourceSelector({ type }: DataSourceSelectorProps) {
  const { youtubeVideos, spotifyTracks, viberateVideos, viberateTracks } = useScrapedDataStore()
  const { dispatch } = useArtistFormStore()

  const handleLoadSource = (source: 'youtube' | 'spotify' | 'viberate') => {
    if (type === 'videos') {
      const videos = source === 'youtube' ? youtubeVideos : viberateVideos
      dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: videos })
    } else {
      const rawTracks = source === 'spotify' ? spotifyTracks : viberateTracks
      dispatch({ type: 'UPDATE_TRACKS', payload: rawTracks })
    }
  }

  const handleClear = () => {
    if (type === 'videos') {
      dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: [] })
    } else {
      dispatch({ type: 'UPDATE_TRACKS', payload: [] })
    }
  }

  const handleJsonImport = (data: any) => {
    try {
      if (type === 'videos') {
        const videos = Array.isArray(data) ? data : [data]
        dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: videos as YoutubeVideoInfo[] })
      } else {
        const rawTracks = Array.isArray(data) ? data : [data]
        dispatch({ type: 'UPDATE_TRACKS', payload: rawTracks })
      }
    } catch (error) {
      console.error('Error importing JSON:', error)
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

      <JsonInputDialog 
        onSubmit={handleJsonImport}
        title={`Import ${type === 'videos' ? 'Videos' : 'Tracks'} from JSON`}
      />
    </div>
  )
} 