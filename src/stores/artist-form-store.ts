import { create } from 'zustand'
import { ArtistFormState, FormAction, SpotifyArtist } from '@/types'

interface ArtistFormStore extends ArtistFormState {
  selectedArtists: SpotifyArtist[];
  dispatch: (action: FormAction) => void;
  refreshYoutubeVideos: (channelId: string) => Promise<void>;
  refreshYoutubeAnalytics: (channelId: string) => Promise<void>;
  refreshSimilarArtists: (artistName: string) => Promise<void>;
}

const initialState = {
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
      case 'SELECT_ARTIST':
        set((state) => ({
         ...state,
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
          artistInfo: {
            ...state.artistInfo,
            ...action.payload,
          },
        }));
        break;
      case 'UPDATE_ANALYTICS':
        set((state) => ({
          analytics: {
            ...state.analytics,
            ...action.payload,
          },
        }));
        break;
      case 'UPDATE_YOUTUBE_VIDEOS':
        set({ youtubeVideos: action.payload });
        break;
      case 'UPDATE_SPOTIFY_TRACKS':
        set({ spotifyTracks: action.payload });
        break;
      case 'UPDATE_SIMILAR_ARTIST_SELECTION':
        set({ similarArtists: action.payload });
        break;
      case 'SET_SUBMITTING':
        set({ isSubmitting: action.payload });
        break;
      case 'SET_ERRORS':
        set({ errors: action.payload });
        break;
      case 'RESET_FORM':
        set(get()); // Reset to initial state
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