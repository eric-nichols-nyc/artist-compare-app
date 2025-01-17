import { create } from 'zustand'
import { 
  SpotifyArtist, 
  SpotifyTrack 
} from '@/types'
import { ArtistFormFull, Analytics, FormAction } from '@/validations/artist-schema'
import { ValidationService } from '@/services/validation-service'

interface ArtistFormStore extends ArtistFormFull {
  selectedArtists: SpotifyArtist[];
  analytics: Analytics;
  dispatch: (action: FormAction) => void;
  refreshYoutubeVideos: (channelId: string) => Promise<void>;
  refreshYoutubeAnalytics: (channelId: string) => Promise<void>;
  validateForm: () => Promise<boolean>;
  spotifyTracks: SpotifyTrack[];
  isSubmitting: boolean;
  submitArtist: () => Promise<void>;
}

const initialState: Omit<ArtistFormStore, 'dispatch' | 'refreshYoutubeVideos' | 'refreshYoutubeAnalytics'  | 'validateForm' | 'submitArtist'> = {
  selectedArtists: [],
  artistInfo: {
    name: '',
    bio: null,
    genres: [],
    spotifyId: '',
    musicbrainzId: '',
    youtubeChannelId: '',
    imageUrl: null,
    spotifyUrl: null,
    youtubeUrl: null,
    tiktokUrl: null,
    instagramUrl: null,
    viberateUrl: null,
    facebookUrl: null,
    websiteUrl: null,
    youtubeChartsUrl: null,
    songStatsUrl: null,
    country: null,
    gender: null,
    birthDate: null,
    birthPlace: null,
  },
  analytics: {
    spotifyMonthlyListeners: null,
    lastFmMonthlyListeners: null,
    youtubeSubscribers: null,
    youtubeTotalViews: null,
    lastfmListeners: null,
    lastfmPlayCount: null,
    spotifyFollowers: null,
    spotifyPopularity: null,
    instagramFollowers: null,
    facebookFollowers: null,
    tiktokFollowers: null,
    soundcloudFollowers: null,
  },
  videos: [],
  tracks: [],
  isSubmitting: false,
  errors: {},
  spotifyTracks: [],
};

export const useArtistFormStore = create<ArtistFormStore>((set, get) => ({
  ...initialState,

  dispatch: (action: FormAction) => {
    switch (action.type) {
      case 'SELECT_ARTIST':          // Handle SpotifyArtist
          set((state) => ({
            ...state,
            selectedArtists: [...state.selectedArtists, action.payload as SpotifyArtist],
            artistInfo: {
              ...state.artistInfo,
              name: action.payload.name || '',
              imageUrl: action.payload.imageUrl || '',
              genres: action.payload.genres || [],
              spotifyId: action.payload.spotifyId || '',
              spotifyUrl: action.payload.spotifyId ? `https://open.spotify.com/artist/${action.payload.spotifyId}` : '',
              youtubeChannelId: '',
              youtubeUrl: null,
            },
            analytics: {
              ...state.analytics,
              spotifyFollowers: action.payload.followers || null,
              spotifyPopularity: action.payload.popularity ||  null,
            }
          }));
        break;
      case 'UPDATE_ARTIST_INFO':
        console.log('UPDATE_ARTIST_INFO', action.payload)
        set((state) => ({
          ...state,
          artistInfo: {
            ...state.artistInfo,
            ...action.payload,
            youtubeUrl: action.payload.youtubeChannelId 
              ? `https://youtube.com/channel/${action.payload.youtubeChannelId}`
              : state.artistInfo.youtubeUrl,
          },
        }));
        break;
      case 'UPDATE_ANALYTICS':
        set((state) => ({
          ...state,
          analytics: {
            ...state.analytics,
            ...action.payload,
          },
        }));
        break;
      case 'UPDATE_YOUTUBE_VIDEOS':
        set((state) => ({
          ...state,
          videos: action.payload
        }));
        break;
      case 'UPDATE_SPOTIFY_TRACKS':
        set((state) => ({
          ...state,
          tracks: action.payload.map(track => ({
            imageUrl: track.imageUrl || '',
            spotifyUrl: track.spotifyUrl,
            title: track.title,
            platform: track.platform,
            trackId: track.trackId,
            popularity: track.popularity,
            spotifyStreams: track.spotifyStreams
          }))
        }));
        break;
      case 'SET_SUBMITTING':
        set((state) => ({
          ...state,
          isSubmitting: action.payload,
        }));
        get().validateForm()
        
        break;
      case 'SET_ERRORS':
        set((state) => ({
          ...state,
          errors: action.payload,
        }));
        break;
      case 'RESET_FORM':
        set(initialState);
        break;
      case 'UPDATE_SPOTIFY_TRACKS':
        set((state) => ({
          ...state,
          spotifyTracks: action.payload
        }));
        break;
    }
  },


  // Custom actions
  refreshYoutubeVideos: async (channelId: string) => {
    try {
      const response = await fetch(`/api/admin/artist-videos?channelId=${encodeURIComponent(channelId)}`);
      const data = await response.json();
      const formattedVideos = (data.videos || []).map((video: any) => ({
        name: video.title,
        videoId: video.videoId,
        platform: 'youtube',
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        thumbnail: video.thumbnail,
        publishedAt: video.publishedAt
      }));
      set({ videos: formattedVideos });
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  },

  refreshYoutubeAnalytics: async (channelId: string) => {
    try {
      const response = await fetch(`/api/admin/youtube-analytics?channelId=${encodeURIComponent(channelId)}`);
      const data = await response.json();
      set((state) => ({
        analytics: {
          ...state.analytics,
          youtubeSubscribers: data.subscriberCount,
          youtubeTotalViews: data.viewCount,
        }
      }));
    } catch (error) {
      console.error('Error fetching YouTube analytics:', error);
    }
  },


  validateForm: async () => {
    const state = get();
    const result = await ValidationService.validateForm({
      artistInfo: state.artistInfo,
      analytics: state.analytics,
      videos: state.videos,
      tracks: state.tracks,
    });
    set({ errors: result.errors || {} });
    console.log('Validation result:', result.isValid)
    return result.isValid;
  },

  submitArtist: async () => {
    const isValid = await get().validateForm();
    if(!isValid){
      throw new Error('Form is not valid');
    }
    try {
      set({ isSubmitting: true });
      
      const state = get();
      const response = await fetch('/api/admin/add-artist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artist: state }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Validation errors:', error);
        throw new Error(error.message || 'Failed to add artist');
      }

      const result = await response.json();
      console.log('Artist added successfully:', result);
      
      // Clear the form state
      set((state) => ({
        ...state,
      ...initialState
      }));

    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },
})); 