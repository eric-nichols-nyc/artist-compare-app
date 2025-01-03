import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ArtistCard } from '../new-artist-card'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { mockSpotifyArtist } from '@/mocks/spotify-artist'
import { rest } from 'msw'
import { server } from '@/mocks/server'
import type { ArtistInfo, ArtistAnalytics, YoutubeVideoInfo, SpotifyTrackInfo, SimilarArtist } from '@/validations/artist-schema'

// Mock all child components
vi.mock('../artist-header', () => ({
  ArtistHeader: () => (<div data-testid="mock-artist-header">Artist Header</div>)
}))

vi.mock('../artist-tracks', () => ({
  ArtistTracks: () => <div data-testid="mock-artist-tracks">Artist Tracks</div>
}))

vi.mock('../artist-videos', () => ({
  ArtistVideos: () => <div data-testid="mock-artist-videos">Artist Videos</div>
}))

vi.mock('../artist-analytics', () => ({
  ArtistAnalytics: () => <div data-testid="mock-artist-analytics">Artist Analytics</div>
}))

vi.mock('../similar-artists', () => ({
  SimilarArtists: () => <div data-testid="mock-similar-artists">Similar Artists</div>
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
    similarArtists: [] as SimilarArtist[],
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
    expect(screen.getByTestId('mock-similar-artists')).toBeInTheDocument()
    expect(screen.getByText('Submit Artist')).toBeInTheDocument()
  })

  it('renders artist information correctly', () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    expect(screen.getByText(mockSpotifyArtist.name)).toBeInTheDocument()
    expect(screen.getByText('Submit Artist')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Fill form data via store with proper types
    useArtistFormStore.setState({
      artistInfo: {
        name: 'Test Artist',
        genres: ['pop'],
        spotifyId: 'spotify123',
        imageUrl: 'https://example.com/image.jpg',
        bio: 'Test bio',
        musicbrainzId: null,
        country: null,
        gender: null,
        age: null,
        youtubeChannelId: null,
        youtubeUrl: null,
        spotifyUrl: null,
        tiktokUrl: null,
        instagramUrl: null,
        viberateUrl: null
      } as ArtistInfo,
      analytics: {
        spotifyFollowers: 1000,
        spotifyPopularity: 80,
        youtubeSubscribers: 5000,
        youtubeTotalViews: null,
        lastfmPlayCount: null,
        spotifyMonthlyListeners: null,
        instagramFollowers: null,
        facebookFollowers: null,
        tiktokFollowers: null,
        soundcloudFollowers: null
      } as ArtistAnalytics,
      videos: [{
        title: 'Test Video',
        videoId: 'xyz123',
        viewCount: 1000,
        likeCount: 100,
        commentCount: 50,
        publishedAt: '2024-03-20T00:00:00Z',
        platform: 'youtube',
        thumbnail: null
      }] as YoutubeVideoInfo[],
      tracks: [{
        name: 'Test Track',
        trackId: 'track123',
        popularity: 75,
        platform: 'spotify',
        previewUrl: null,
        imageUrl: null,
        spotifyStreams: null,
        externalUrl: null
      }] as SpotifyTrackInfo[]
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
      rest.post('/api/admin/add-artist', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({ message: 'Validation failed' })
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

  it('handles multiple similar artist selections', async () => {
    render(<ArtistCard artist={mockSpotifyArtist} />)
    
    // Mock multiple similar artists
    const similarArtists = [
      {
        id: '1',
        name: 'Similar Artist 1',
        genres: ['pop'],
        popularity: 75,
        imageUrl: 'https://example.com/1.jpg',
        match: 0.8
      },
      {
        id: '2',
        name: 'Similar Artist 2',
        genres: ['rock'],
        popularity: 80,
        imageUrl: 'https://example.com/2.jpg',
        match: 0.7
      }
    ]

    // Simulate selecting multiple artists
    useArtistFormStore.getState().dispatch({ 
      type: 'UPDATE_SIMILAR_ARTIST_SELECTION', 
      payload: similarArtists
    })

    const state = useArtistFormStore.getState()
    expect(state.similarArtists).toHaveLength(2)
    expect(state.similarArtists).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: '1' }),
      expect.objectContaining({ id: '2' })
    ]))
  })

  it('preserves existing similar artists when adding new ones', async () => {
    // Start with one similar artist
    useArtistFormStore.setState({
      similarArtists: [{
        id: '1',
        name: 'Existing Artist',
        genres: ['pop'],
        popularity: 70,
        imageUrl: 'https://example.com/1.jpg',
        match: 0.9,
        selected: true
      }]
    })

    render(<ArtistCard artist={mockSpotifyArtist} />)

    // Add another similar artist
    useArtistFormStore.getState().dispatch({
      type: 'UPDATE_SIMILAR_ARTIST_SELECTION',
      payload: [{
        id: '2',
        name: 'New Artist',
        genres: ['rock'],
        popularity: 80,
        imageUrl: 'https://example.com/2.jpg',
        match: 0.7
      }]
    })

    const state = useArtistFormStore.getState()
    expect(state.similarArtists).toHaveLength(2)
    
    // Check that existing artist is preserved with its selected state
    const existingArtist = state.similarArtists.find(a => a.id === '1')
    expect(existingArtist?.selected).toBe(true)
    
    // Check that new artist was added
    expect(state.similarArtists).toEqual(expect.arrayContaining([
      expect.objectContaining({ 
        id: '1',
        selected: true 
      }),
      expect.objectContaining({ 
        id: '2',
        selected: false  // New artists should default to unselected
      })
    ]))
  })
}) 