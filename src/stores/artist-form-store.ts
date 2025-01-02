import { create } from 'zustand'
import { 
  SpotifyArtist, 
} from '@/types'
import { ArtistFormFull, Analytics, FormAction } from '@/validations/artist-schema'
import { ValidationService } from '@/services/validation-service'

interface SpotifyTrack {
  name: string;
  trackId: string;
  popularity: number;
  platform: string;
  previewUrl: string | null;
  imageUrl: string | null;
  spotifyStreams: number | null;
  externalUrl: string | null;
}

interface ArtistFormStore extends ArtistFormFull {
  selectedArtists: SpotifyArtist[];
  analytics: Analytics;
  dispatch: (action: FormAction) => void;
  refreshYoutubeVideos: (channelId: string) => Promise<void>;
  refreshYoutubeAnalytics: (channelId: string) => Promise<void>;
  refreshSimilarArtists: (artistName: string) => Promise<void>;
  validateForm: () => Promise<boolean>;  // Add this
  spotifyTracks: SpotifyTrack[];
  isSubmitting: boolean;
  submitArtist: () => Promise<void>;
}

const initialState: Omit<ArtistFormStore, 'dispatch' | 'refreshYoutubeVideos' | 'refreshYoutubeAnalytics' | 'refreshSimilarArtists' | 'validateForm' | 'submitArtist'> = {
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

  refreshSimilarArtists: async (artistName: string) => {
    try {
      const response = await fetch(`/api/admin/similar-spotify-artists?name=${encodeURIComponent(artistName)}`);
      const data = await response.json();
      set({ similarArtists: data || [] });
    } catch (error) {
      console.error('Error fetching similar artists:', error);
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

  submitArtist: async () => {
    // validate the form
    const isValid = await get().validateForm();
    if(!isValid){
      throw new Error('Form is not valid');
      return;
    }
    try {
      set({ isSubmitting: true });
      
      const state = get();
      const formattedData = {
        artistInfo: {
          name: state.artistInfo.name,
          bio: state.artistInfo.bio || null,
          gender: state.artistInfo.gender || null,
          country: state.artistInfo.country || null,
          genres: state.artistInfo.genres || [],
          age: state.artistInfo.age || null,
          musicbrainzId: state.artistInfo.musicbrainzId || null,
          youtubeChannelId: state.artistInfo.youtubeChannelId || null,
          spotifyId: state.artistInfo.spotifyId || null,
          imageUrl: state.artistInfo.imageUrl || null,
          youtubeUrl: state.artistInfo.youtubeUrl || null,
          spotifyUrl: state.artistInfo.spotifyUrl || null,
          instagramUrl: state.artistInfo.instagramUrl || null,
          tiktokUrl: state.artistInfo.tiktokUrl || null
        },
        analytics: state.analytics,
        videos: state.videos.map(video => ({
          name: video.name,
          videoId: video.videoId,
          platform: 'youtube',
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          commentCount: video.commentCount,
          thumbnail: null,
          publishedAt: video.publishedAt
        })),
        tracks: state.tracks.map(track => ({
          name: track.name,
          trackId: track.trackId,
          platform: track.platform,
          popularity: track.popularity,
          previewUrl: track.previewUrl,
          imageUrl: track.imageUrl,
          spotifyStreams: track.spotifyStreams,
          externalUrl: track.externalUrl
        })),
        similarArtists: state.similarArtists || []
      };

      const response = await fetch('/api/admin/add-artist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artist: formattedData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add artist');
      }

      const result = await response.json();
      console.log('Artist added successfully:', result);
      
      // Clear the form state
      set((state) => ({
        ...state,
        artistInfo: {},
        analytics: {},
        videos: [],
        tracks: [],
        similarArtists: [],
        selectedArtist: null
      }));

    } catch (error) {
      console.error("Error submitting form:", error);
      throw error; // Let the component handle the error display
    } finally {
      set({ isSubmitting: false });
    }
  },
})); 