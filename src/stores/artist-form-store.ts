import { create } from 'zustand'
import { 
  SpotifyArtist, 
} from '@/types'
import { ArtistFormFull, Analytics, FormAction } from '@/validations/artist-schema'
import { ValidationService } from '@/services/validation-service'

interface ArtistFormStore extends ArtistFormFull {
  selectedArtists: SpotifyArtist[];
  analytics: Analytics;
  dispatch: (action: FormAction) => void;
  refreshYoutubeVideos: (channelId: string) => Promise<void>;
  refreshYoutubeAnalytics: (channelId: string) => Promise<void>;
  refreshSimilarArtists: (artistName: string) => Promise<void>;
  validateForm: () => Promise<boolean>;  // Add this
}

const initialState: Omit<ArtistFormStore, 'dispatch' | 'refreshYoutubeVideos' | 'refreshYoutubeAnalytics' | 'refreshSimilarArtists' | 'validateForm'> = {
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
    age: null,
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
  videos: [],
  tracks: [],
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
          videos: action.payload
        }));
        break;
      case 'UPDATE_TRACKS':
        console.log('action.payload = ', action.payload)
        set((state) => ({
          ...state,
          tracks: action.payload,
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
    }
  },

  validateForm: async () => {
    const state = get();
    const result = await ValidationService.validateForm({
      artistInfo: state.artistInfo,
      analytics: state.analytics,
      videos: state.videos,
      tracks: state.tracks,
      similarArtists: state.similarArtists
    });
    set({ errors: result.errors || {} });
    console.log('Validation result:', result.isValid)
    return result.isValid;
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