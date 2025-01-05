import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {YoutubeVideoInfo, SpotifyTrackInfo} from "@/validations/artist-schema"
import { ViberateSpTrack, ViberateVideo } from '@/types'

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
  youtubeVideos: Partial<YoutubeVideoInfo>[]
  setYoutubeVideos: (videos: YoutubeVideoInfo[]) => void
  clearYoutubeVideos: () => void

  // Spotify Data
  spotifyTracks: SpotifyTrackInfo[]
  setSpotifyTracks: (tracks: SpotifyTrackInfo[]) => void
  clearSpotifyTracks: () => void

  // Spotify Monthly Listeners
  spotifyMonthlyListeners: number
  setSpotifyMonthlyListeners: (listeners: number) => void
  clearSpotifyMonthlyListeners: () => void

  // Viberate Data
  viberateVideos: Partial<YoutubeVideoInfo>[]
  viberateTracks: Partial<ViberateSpTrack>[]
  setViberateVideos: (videos: Partial<YoutubeVideoInfo>[]) => void
  setViberateTracks: (tracks: Partial<ViberateSpTrack>[]) => void
  clearViberateData: () => void

  // Add social stats
  socialStats: SocialStats

  // Add social stats setter
  setSocialStats: (stats: SocialStats) => void

  // Add social stats clearer
  clearSocialStats: () => void

  viberateSocialStats: any
  setViberateSocialStats: (stats: any) => void
}

export const useScrapedDataStore = create<ScrapedDataStore>()(
  devtools(
    (set) => ({
      youtubeVideos: [],
      spotifyTracks: [],
      viberateVideos: [],
      viberateTracks: [],
      socialStats: {},
      spotifyMonthlyListeners: 0,

      setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
      setSpotifyTracks: (tracks) => set({ spotifyTracks: tracks }),
      setViberateVideos: (videos) => set({ viberateVideos: videos }),
      setViberateTracks: (tracks) => set({ viberateTracks: tracks }),
      setSocialStats: (stats) => set({ socialStats: stats }),

      clearYoutubeVideos: () => set({ youtubeVideos: [] }),
      clearSpotifyTracks: () => set({ spotifyTracks: [] }),
      clearViberateData: () => set({ viberateVideos: [], viberateTracks: [] }),
      clearSocialStats: () => set({ socialStats: {} }),

      setSpotifyMonthlyListeners: (listeners) => set({ spotifyMonthlyListeners: listeners }),
      clearSpotifyMonthlyListeners: () => set({ spotifyMonthlyListeners: 0 }),

      viberateSocialStats: null,
      setViberateSocialStats: (stats) => set({ viberateSocialStats: stats }),
    }),
    { name: 'Scraped Data Store' }
  )
) 