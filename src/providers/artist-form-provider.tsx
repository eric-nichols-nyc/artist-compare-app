/**
 * Artist Form State Management System
 * ----------------------------------
 * This module provides a centralized state management solution for the multi-section artist form.
 * 
 * Key Features:
 * 1. Context-based state management using React Context
 * 2. Type-safe actions and state updates
 * 3. Section-by-section form validation
 * 4. Integrated with Zod schema validation
 * 
 * Form Sections:
 * - Artist Info: Basic details, platform IDs, and social links
 * - Analytics: Performance metrics across platforms
 * - YouTube Videos: Top video statistics and metadata
 * - Spotify Tracks: Popular tracks and streaming data
 * 
 * Usage:
 * 1. Wrap your app/form with ArtistFormProvider:
 *    <ArtistFormProvider>
 *      <YourFormComponents />
 *    </ArtistFormProvider>
 * 
 * 2. Access state and dispatch in components:
 *    const { state, dispatch } = useArtistForm();
 * 
 * 3. Update form sections:
 *    dispatch({ 
 *      type: 'UPDATE_ARTIST_INFO', 
 *      payload: { name: 'New Name' } 
 *    });
 * 
 * 4. Handle validation:
 *    const validation = await validateForm(state);
 *    if (validation.isValid) {
 *      // proceed with submission
 *    }
 * 
 * State Updates:
 * - Each section has its own action type (UPDATE_ARTIST_INFO, UPDATE_ANALYTICS, etc.)
 * - Updates are merged at the section level (not deep merge)
 * - Validation runs on each section update
 * 
 * Error Handling:
 * - Validation errors are stored in state.errors
 * - Each field can have its own error message
 * - Section-level validation available
 * 
 * @see useArtistForm - Custom hook for accessing form context
 * @see validateForm - Form validation utility
 * @see FormSubmissionService - Form submission handler
 */

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { artistFormSchema } from '@/validations/artist-form-schema';
// Types for each section
import { ArtistInfo, Analytics, YoutubeVideo, SpotifyTrack } from '@/types';


/**
 * ArtistFormState Structure
 * ------------------------
 * Complete state interface for the artist form. Each section maintains its own
 * slice of state with specific data requirements.
 * 
 * State Sections:
 * 
 * artistInfo: {
 *   name: string;           // Required
 *   bio: string | null;     // Optional
 *   genres: string[];       // At least one required
 *   spotifyId: string | null;
 *   musicbrainzId: string | null;
 *   youtubeChannelId: string | null;
 *   // At least one platform ID required
 *   // Social URLs and image - all optional
 * }
 * 
 * analytics: {
 *   // All metrics are optional but must be positive numbers if provided
 *   monthlyListeners: number | null;
 *   youtubeSubscribers: number | null;
 *   // ... other metrics
 * }
 * 
 * youtubeVideos: Array<{
 *   // Complete video data with required fields
 *   title: string;
 *   videoId: string;
 *   viewCount: number;
 *   // ... other video metadata
 * }>
 * 
 * spotifyTracks: Array<{
 *   // Complete track data with required fields
 *   name: string;
 *   trackId: string;
 *   popularity: number;
 *   // ... other track metadata
 * }>
 * 
 * Common State:
 * isSubmitting: boolean    // Form submission status
 * errors: Record<string, string>  // Validation errors by field path
 */
interface ArtistFormState {
  artistInfo: ArtistInfo;
  analytics: Analytics;
  youtubeVideos: YoutubeVideo[];
  spotifyTracks: SpotifyTrack[];
  isSubmitting: boolean;
  errors: Record<string, string>;
}

/**
 * Form Actions
 * -----------
 * Available actions for updating form state. Each action is strongly typed
 * and corresponds to a specific state update operation.
 * 
 * UPDATE_ARTIST_INFO:
 * - Updates artist basic information
 * - Partial updates allowed
 * - Example: dispatch({ type: 'UPDATE_ARTIST_INFO', payload: { name: 'New Name' } })
 * 
 * UPDATE_ANALYTICS:
 * - Updates platform analytics
 * - Null values allowed for optional metrics
 * - Example: dispatch({ type: 'UPDATE_ANALYTICS', payload: { monthlyListeners: 1000 } })
 * 
 * UPDATE_YOUTUBE_VIDEOS:
 * - Replaces entire videos array
 * - Requires complete video objects
 * - Example: dispatch({ type: 'UPDATE_YOUTUBE_VIDEOS', payload: newVideosArray })
 * 
 * UPDATE_SPOTIFY_TRACKS:
 * - Replaces entire tracks array
 * - Requires complete track objects
 * - Example: dispatch({ type: 'UPDATE_SPOTIFY_TRACKS', payload: newTracksArray })
 * 
 * SET_SUBMITTING:
 * - Updates form submission status
 * - Used for loading states
 * - Example: dispatch({ type: 'SET_SUBMITTING', payload: true })
 * 
 * SET_ERRORS:
 * - Updates validation errors
 * - Keyed by field path
 * - Example: dispatch({ type: 'SET_ERRORS', payload: { 'artistInfo.name': 'Required' } })
 * 
 * RESET_FORM:
 * - Resets entire form to initial state
 * - No payload required
 * - Example: dispatch({ type: 'RESET_FORM' })
 */
type FormAction =
  | { type: 'UPDATE_ARTIST_INFO'; payload: Partial<ArtistInfo> }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<Analytics> }
  | { type: 'UPDATE_YOUTUBE_VIDEOS'; payload: YoutubeVideo[] }
  | { type: 'UPDATE_SPOTIFY_TRACKS'; payload: SpotifyTrack[] }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: ArtistFormState = {
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
  isSubmitting: false,
  errors: {},
};

// Reducer function
function formReducer(state: ArtistFormState, action: FormAction): ArtistFormState {
  switch (action.type) {
    case 'UPDATE_ARTIST_INFO':
      return {
        ...state,
        artistInfo: {
          ...state.artistInfo,
          ...action.payload,
        },
      };
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload,
        },
      };
    case 'UPDATE_YOUTUBE_VIDEOS':
      return {
        ...state,
        youtubeVideos: action.payload,
      };
    case 'UPDATE_SPOTIFY_TRACKS':
      return {
        ...state,
        spotifyTracks: action.payload,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Create context
const ArtistFormContext = createContext<{
  state: ArtistFormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

// Provider component
export function ArtistFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    console.log('artistProvider state', JSON.stringify(state, null, 2));
  }, [state]);

  return (
    <ArtistFormContext.Provider value={{ state, dispatch }}>
      {children}
    </ArtistFormContext.Provider>
  );
}

// Custom hook for using the form context
export function useArtistForm() {
  const context = useContext(ArtistFormContext);
  if (!context) {
    throw new Error('useArtistForm must be used within an ArtistFormProvider');
  }
  return context;
}

// Utility function to validate form data
export async function validateForm(state: ArtistFormState): Promise<{ 
  isValid: boolean; 
  errors: Record<string, string> | null;
}> {
  try {
    const result = await artistFormSchema.safeParseAsync({
      artistInfo: state.artistInfo,
      analytics: state.analytics,
      youtubeVideos: state.youtubeVideos,
      spotifyTracks: state.spotifyTracks,
    });

    if (!result.success) {
      const errors = result.error.errors.reduce((acc, curr) => {
        const path = curr.path.join('.');
        acc[path] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return { isValid: false, errors };
    }

    return { isValid: true, errors: null };
  } catch (error) {
    console.error('Validation error:', error);
    return { 
      isValid: false, 
      errors: { general: 'An error occurred during validation' } 
    };
  }
}

// Utility function to prepare form data for submission
export function prepareFormData(state: ArtistFormState) {
  return {
    ...state,
    artistInfo: {
      ...state.artistInfo,
      genres: state.artistInfo.genres.filter(Boolean), // Remove empty genres
    },
    youtubeVideos: state.youtubeVideos.map(video => ({
      ...video,
      likeCount: Number(video.likeCount),
      commentCount: Number(video.commentCount),
    })),
    spotifyTracks: state.spotifyTracks.map(track => ({
      ...track,
      popularity: Number(track.popularity),
      spotifyStreams: track.spotifyStreams ? Number(track.spotifyStreams) : null,
    })),
  };
}