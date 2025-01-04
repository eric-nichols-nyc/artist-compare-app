import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {YoutubeVideoInfo, SpotifyTrackInfo} from "@/validations/artist-schema"
import { ViberateSpTrack } from '@/types'

interface SocialStats {
  facebook?: number
  instagram?: number
  youtube?: number
  spotify?: number
  tiktok?: number
  soundcloud?: number
}

interface ViberateTrack {
  title: string
  monthlyStreams: string | null
  totalStreams: string | null
}

interface ScrapedDataStore {
  // YouTube Data
  youtubeVideos: YoutubeVideoInfo[]
  setYoutubeVideos: (videos: YoutubeVideoInfo[]) => void
  clearYoutubeVideos: () => void

  // Spotify Data
  spotifyTracks: SpotifyTrackInfo[]
  setSpotifyTracks: (tracks: SpotifyTrackInfo[]) => void
  clearSpotifyTracks: () => void

  // Viberate Data
  viberateVideos: YoutubeVideoInfo[]
  viberateTracks: ViberateSpTrack[]
  setViberateVideos: (videos: YoutubeVideoInfo[]) => void
  setViberateTracks: (tracks: ViberateSpTrack[]) => void
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

      setYoutubeVideos: (videos) => set({ youtubeVideos: videos }),
      setSpotifyTracks: (tracks) => set({ spotifyTracks: tracks }),
      setViberateVideos: (videos) => set({ viberateVideos: videos }),
      setViberateTracks: (tracks) => set({ viberateTracks: tracks }),
      setSocialStats: (stats) => set({ socialStats: stats }),

      clearYoutubeVideos: () => set({ youtubeVideos: [] }),
      clearSpotifyTracks: () => set({ spotifyTracks: [] }),
      clearViberateData: () => set({ viberateVideos: [], viberateTracks: [] }),
      clearSocialStats: () => set({ socialStats: {} }),

      viberateSocialStats: null,
      setViberateSocialStats: (stats) => set({ viberateSocialStats: stats }),
    }),
    { name: 'Scraped Data Store' }
  )
) 