import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ArtistCard } from '../new-artist-card'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { mockSpotifyArtist } from '@/mocks/spotify-artist'
import { http } from 'msw'
import { server } from '@/mocks/server'
import type { ArtistInfo, ArtistAnalytics, YoutubeVideoInfo, SpotifyTrackInfo } from '@/validations/artist-schema'

// Mock all child components
vi.mock('../artist-header', () => ({
  ArtistHeader: (props: any) => (
    <div data-testid="mock-artist-header">
      Artist Header: {props.artist.name}
    </div>
  )
}))

// Add these mocks back after the artist-header mock
vi.mock('../artist-tracks', () => ({
  ArtistTracks: () => <div data-testid="mock-artist-tracks">Artist Tracks</div>
}))

vi.mock('../artist-videos', () => ({
  ArtistVideos: () => <div data-testid="mock-artist-videos">Artist Videos</div>
}))

vi.mock('../artist-analytics', () => ({
  ArtistAnalytics: () => <div data-testid="mock-artist-analytics">Artist Analytics</div>
}))


vi.mock('../dockable-artist-header', () => ({
  DockableArtistHeader: () => <div data-testid="mock-dockable-header">Dockable Header</div>
}))

// Reset store between tests
beforeEach(() => {
  useArtistFormStore.setState({
    artistInfo: {} as ArtistInfo,
    analytics: {} as ArtistAnalytics,
    videos: [] as YoutubeVideoInfo[],
    tracks: [] as SpotifyTrackInfo[],
    isSubmitting: false,
    errors: {}
  })
})

describe('ArtistCard', () => {
  it('renders all components correctly', () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Check that all components are rendered
    expect(screen.getByTestId('mock-dockable-header')).toBeInTheDocument()
    expect(screen.getByTestId('mock-artist-header')).toBeInTheDocument()
    expect(screen.getByTestId('mock-artist-videos')).toBeInTheDocument()
    expect(screen.getByTestId('mock-artist-tracks')).toBeInTheDocument()
    expect(screen.getByTestId('mock-artist-analytics')).toBeInTheDocument()
    expect(screen.getByText('Submit Artist')).toBeInTheDocument()
  })

  it('renders artist information correctly', () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    expect(screen.getByText('Submit Artist')).toBeInTheDocument()
  })

  it('handles form submission with valid data', async () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Fill form data via store with proper types
    useArtistFormStore.setState({
      artistInfo: {
        name: "Drake",
        bio: "Aubrey \"Drake\" Graham (born October 24, 1986) is an Canadian rapper...",
        genres: ["canadian hip hop", "canadian pop", "hip hop", "pop rap", "rap"],
        spotifyId: "3TVXtAsR1Inumwj472S9r4",
        musicbrainzId: "9fff2f8a-21e6-47de-a2b8-7f449929d43f",
        youtubeChannelId: "UCByOQJjav0CUDwxCk-jVNRQ",
        imageUrl: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
        spotifyUrl: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
        youtubeUrl: "https://youtube.com/channel/UCByOQJjav0CUDwxCk-jVNRQ",
        tiktokUrl: null,
        instagramUrl: null,
        country: "CA",
        gender: "male",
        viberateUrl: null,
        age: 38
      },
      analytics: {
        spotifyMonthlyListeners: null,
        youtubeSubscribers: 30400000,
        youtubeTotalViews: 19003834546,
        lastfmListeners: 5850998,
        lastfmPlayCount: 800575942,
        spotifyFollowers: 94924678,
        spotifyPopularity: 97,
        instagramFollowers: null,
        facebookFollowers: null,
        tiktokFollowers: null,
        soundcloudFollowers: null
      },
      videos: [
        {
          title: "Drake - When To Say When & Chicago Freestyle",
          videoId: "0jz0GAFNNIo",
          platform: "youtube",
          thumbnail: "https://i.ytimg.com/vi/0jz0GAFNNIo/hqdefault.jpg",
          publishedAt: "2020-03-01T04:13:08Z",
          viewCount: 81253136,
          likeCount: 1047858,
          commentCount: 42518
        }
      ],
      tracks: [
        {
          trackId: "1zi7xx7UVEFkmKfv06H8x0",
          name: "One Dance",
          imageUrl: "https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c",
          popularity: 85,
          previewUrl: null,
          externalUrl: "https://open.spotify.com/track/1zi7xx7UVEFkmKfv06H8x0",
          spotifyStreams: null,
          platform: "spotify"
        }
      ],
      isSubmitting: false,
      errors: {}
    })

    const submitButton = screen.getByText('Submit Artist')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument()
    })
  })

  it('shows validation errors', async () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Submit with empty data
    const submitButton = screen.getByText('Submit Artist')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Form is not valid')).toBeInTheDocument()
    })
  })

  it('handles cancellation', () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    // Verify store was reset
    const state = useArtistFormStore.getState()
    expect(state.artistInfo).toEqual({})
  })

  it('updates store when child components trigger changes', async () => {
    // Mock the dispatch function
    const dispatchSpy = vi.spyOn(useArtistFormStore.getState(), 'dispatch')
    
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Simulate updates from child components
    useArtistFormStore.getState().dispatch({ 
      type: 'UPDATE_ANALYTICS', 
      payload: { spotifyFollowers: 1000 } 
    })

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPDATE_ANALYTICS',
      payload: { spotifyFollowers: 1000 }
    })
  })

  it('shows loading states in child components while submitting', async () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Set submitting state
    useArtistFormStore.setState({ isSubmitting: true })

    // Check that loading states are shown
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
  })

  it('handles API errors during submission', async () => {
    // Mock a failed API response
    server.use(
      http.post('/api/admin/add-artist', ({ request }) => {
        return new Response(
          JSON.stringify({ message: 'Validation failed' }), 
          { status: 400 }
        )
      })
    )

    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    const submitButton = screen.getByText('Submit Artist')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Error submitting form')).toBeInTheDocument()
    })
  })

}) 