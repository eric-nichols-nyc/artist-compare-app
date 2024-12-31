import { create } from 'zustand'
import { 
  ArtistFormState, 
  FormAction, 
  SpotifyArtist, 
} from '@/types'
import { Analytics } from '@/types/analytics' 

interface ArtistFormStore extends ArtistFormState {
  selectedArtists: SpotifyArtist[];
  analytics: Analytics;
  dispatch: (action: FormAction) => void;
  refreshYoutubeVideos: (channelId: string) => Promise<void>;
  refreshYoutubeAnalytics: (channelId: string) => Promise<void>;
  refreshSimilarArtists: (artistName: string) => Promise<void>;
}

const initialState: Omit<ArtistFormStore, 'dispatch' | 'refreshYoutubeVideos' | 'refreshYoutubeAnalytics' | 'refreshSimilarArtists'> = {
  selectedArtists: [],
  artistInfo: {
    name: '',
    bio: null,
    genres: [],
    spotifyId: null,
    musicbrainzId: null,
    youtubeChannelId: null,
    imageUrl: null,
    spotifyUrl: null,
    youtubeUrl: null,
    tiktokUrl: null,
    instagramUrl: null,
    country: null,
    gender: null,
    viberateUrl: null,
    activeYears: {
      begin: null,
      end: null,
    },
  },
  analytics: {
    spotifyMonthlyListeners: null,
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
  youtubeVideos: [],
  spotifyTracks: [],
  similarArtists: [],
  isSubmitting: false,
  errors: {},
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
              spotifyId: action.payload.spotifyId || null,
              spotifyUrl: action.payload.spotifyId ? `https://open.spotify.com/artist/${action.payload.spotifyId}` : null,
              youtubeChannelId: null, // Will be updated later via API
              youtubeUrl: null, // Will be updated when youtubeChannelId is available
            },
            analytics: {
              ...state.analytics,
              spotifyFollowers: action.payload.followers || null,
              spotifyPopularity: action.payload.popularity ||  null,
            }
          }));
        break;

      case 'CANCEL_ARTIST_SELECTION':
        set((state) => ({
          ...initialState,
          dispatch: state.dispatch,
          refreshYoutubeVideos: state.refreshYoutubeVideos,
          refreshYoutubeAnalytics: state.refreshYoutubeAnalytics,
          refreshSimilarArtists: state.refreshSimilarArtists,
        }));
        break;

      case 'UPDATE_ARTIST_INFO':
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
          youtubeVideos: action.payload,
        }));
        break;
      case 'UPDATE_SPOTIFY_TRACKS':
        set((state) => ({
          ...state,
          spotifyTracks: action.payload,
        }));
        break;
      case 'UPDATE_SIMILAR_ARTIST_SELECTION':
        set((state) => ({
          ...state,
          similarArtists: action.payload,
        }));
        break;
      case 'SET_SUBMITTING':
        set((state) => ({
          ...state,
          isSubmitting: action.payload,
        }));
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
    }
  },

  // Custom actions
  refreshYoutubeVideos: async (channelId: string) => {
    try {
      const response = await fetch(`/api/admin/artist-videos?channelId=${encodeURIComponent(channelId)}`);
      const data = await response.json();
      set({ youtubeVideos: data.videos || [] });
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

  refreshSimilarArtists: async (artistName: string) => {
    try {
      const response = await fetch(`/api/admin/similar-spotify-artists?name=${encodeURIComponent(artistName)}`);
      const data = await response.json();
      set({ similarArtists: data || [] });
    } catch (error) {
      console.error('Error fetching similar artists:', error);
    }
  },
})); 