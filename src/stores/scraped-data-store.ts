import { create } from 'zustand'
import { YoutubeVideo, SpotifyTrack } from '@/validations/artist-form-schema'

interface SocialStats {
  facebook?: number
  instagram?: number
  youtube?: number
  spotify?: number
  tiktok?: number
  soundcloud?: number
}

interface ScrapedDataStore {
  // YouTube Data
  youtubeVideos: YoutubeVideo[]
  setYoutubeVideos: (videos: YoutubeVideo[]) => void
  clearYoutubeVideos: () => void

  // Spotify Data
  spotifyTracks: SpotifyTrack[]
  setSpotifyTracks: (tracks: SpotifyTrack[]) => void
  clearSpotifyTracks: () => void

  // Viberate Data
  viberateVideos: YoutubeVideo[]
  viberateTracks: SpotifyTrack[]
  setViberateVideos: (videos: YoutubeVideo[]) => void
  setViberateTracks: (tracks: SpotifyTrack[]) => void
  clearViberateData: () => void

  // Add social stats
  socialStats: SocialStats

  // Add social stats setter
  setSocialStats: (stats: SocialStats) => void
}

export const useScrapedDataStore = create<ScrapedDataStore>((set) => ({
  youtubeVideos: [],
  spotifyTracks: [],
  viberateVideos: [],
  viberateTracks: [],
  socialStats: {},

  setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
  setSpotifyTracks: (tracks) => set({ spotifyTracks: tracks }),
  setViberateVideos: (videos) => set({ viberateVideos: videos }),
  setViberateTracks: (tracks) => set({ viberateTracks: tracks }),
  setSocialStats: (stats) => set({ socialStats: stats }),

  clearYoutubeVideos: () => set({ youtubeVideos: [] }),
  clearSpotifyTracks: () => set({ spotifyTracks: [] }),
  clearViberateData: () => set({ viberateVideos: [], viberateTracks: [] }),
  clearSocialStats: () => set({ socialStats: {} }),
})) 