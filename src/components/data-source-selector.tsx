import { Button } from '@/components/ui/button'
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { JsonInputDialog } from './json-input-dialog'
import { YoutubeVideo, SpotifyTrack } from '@/validations/artist-form-schema'

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
      const formattedTracks = rawTracks.map(track => ({
        trackId: track.id,
        name: track.name,
        popularity: track.popularity,
        spotifyStreams: track.spotifyStreams,
        albumImageUrl: track.imageUrl,
        previewUrl: null,
        preview_url: null,
        external_urls: { spotify: track.externalUrl || '' },
        duration_ms: 0,
        album: {
          images: [{ url: track.imageUrl || '' }]
        }
      }))
      dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: formattedTracks })
    }
  }

  const handleClear = () => {
    if (type === 'videos') {
      dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: [] })
    } else {
      dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: [] })
    }
  }

  const handleJsonImport = (data: any) => {
    try {
      if (type === 'videos') {
        const videos = Array.isArray(data) ? data : [data]
        dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: videos as YoutubeVideo[] })
      } else {
        const rawTracks = Array.isArray(data) ? data : [data]
        const formattedTracks = rawTracks.map(track => ({
          trackId: track.id,
          name: track.name,
          popularity: track.popularity,
          spotifyStreams: track.spotifyStreams,
          albumImageUrl: track.imageUrl,
          previewUrl: null,
          preview_url: null,
          external_urls: { spotify: track.externalUrl || '' },
          duration_ms: 0,
          album: {
            images: [{ url: track.imageUrl || '' }]
          }
        }))
        dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: formattedTracks })
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