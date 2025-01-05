import z from "zod";
// import { Prisma } from "@prisma/client"
import { SpotifyTrack } from "@/types";

export type FormAction =
  | { type: 'UPDATE_ARTIST_INFO'; payload: Partial<ArtistInfo> }
  | { type: 'SELECT_ARTIST'; payload: SpotifyArtist }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<Analytics> }
  | { type: 'UPDATE_YOUTUBE_VIDEOS'; payload: YoutubeVideoInfo[] }
  | { type: 'UPDATE_SPOTIFY_TRACKS'; payload: SpotifyTrack[] }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'UPDATE_SIMILAR_ARTIST_SELECTION'; payload: SimilarArtist[] }
  | { type: 'RESET_FORM' }
  | { type: 'CANCEL_ARTIST_SELECTION' };


export interface Analytics {
    spotifyFollowers?: number | null;
    spotifyPopularity?: number | null;
    spotifyMonthlyListeners?: number | null;
    lastFmMonthlyListeners?: number | null;
    youtubeSubscribers?: number | null;
    youtubeTotalViews?: number | null;
    lastfmListeners?: number | null;
    lastfmPlayCount?: number | null;
    instagramFollowers?: number | null;
    facebookFollowers?: number | null;
    tiktokFollowers?: number | null;
    soundcloudFollowers?: number | null;
} 

export interface BasicArtistInfo {
    name: string;
    spotifyId: string;
    imageUrl: string | null;
    genres: string[];
}

export interface SpotifyArtist extends BasicArtistInfo {
    followers: number | null;
    popularity: number | null;
}

export interface ArtistFull {
  name: string;
  spotifyId: string;
  musicbrainzId: string | null;
  youtubeChannelId: string | null;
  bio: string | null;
  genres: string[];
  gender: string | null;
  country: string | null;
  birthDate: Date | null;
  birthPlace: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  instagramUrl: string | null;
  viberateUrl: string | null;
  websiteUrl: string | null;
  youtubeChartsUrl: string | null;
  songStatsUrl: string | null;
}

export interface YoutubeVideo {
    title: string;
    videoId: string;
    platform: string;
    viewCount: number;
    likeCount?: number;
    thumbnail: string | null;
    monthlyStreams?: number;
    totalStreams?: number;
}

export interface SimilarArtist {
    id: string;
    name: string;
    popularity: number | null;
    imageUrl: string | null;
    genres: string[];
    match: number | null;
    selected?: boolean | null;
}

// Basic artist info
export const artistBasicSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  bio: z.string().nullable(),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  country: z.string().nullable(),
  gender: z.string().nullable(),
  birthDate: z.date().nullable(),
  birthPlace: z.string().nullable(),
}) satisfies z.Schema<Pick<ArtistFull, "name" | "bio" | "genres" | "country" | "gender" | "birthDate" | "birthPlace">>;

// Platform IDs
export const artistPlatformSchema = z.object({
  spotifyId: z.string().min(1, "Spotify ID is required"),
  musicbrainzId: z.string().min(1, "MusicBrainz ID is required"),
  youtubeChannelId: z.string().min(1, "Youtube Channel ID is required"),
}) satisfies z.Schema<Pick<ArtistFull, "spotifyId" | "musicbrainzId" | "youtubeChannelId">>;

// Social URLs
export const artistSocialSchema = z.object({
  imageUrl: z.string().nullable(),
  youtubeUrl: z.string().nullable(),
  facebookUrl: z.string().nullable(),
  spotifyUrl: z.string().nullable(),
  tiktokUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
  viberateUrl: z.string().nullable(),
  youtubeChartsUrl: z.string().nullable(),
  songStatsUrl: z.string().nullable(),
  websiteUrl: z.string().nullable(),
}) satisfies z.Schema<Pick<ArtistFull, "imageUrl" | "youtubeUrl" | "spotifyUrl" | "tiktokUrl" | "instagramUrl" | "viberateUrl" | "youtubeChartsUrl" | "songStatsUrl">>;

// Combined schema for full artist validation
export const artistSchema = artistBasicSchema
  .merge(artistPlatformSchema)
  .merge(artistSocialSchema) satisfies z.Schema<ArtistFull>;

// Analytics schema remains separate
export const analyticsSchema = z.object({
  spotifyFollowers: z.number().nullable().optional(),
  spotifyPopularity: z.number().nullable().optional(),
  spotifyMonthlyListeners: z.number().nullable().optional(),
  lastFmMonthlyListeners: z.number().nullable().optional(),
  youtubeSubscribers: z.number().nullable().optional(),
  youtubeTotalViews: z.number().nullable().optional(),
  lastfmListeners: z.number().nullable().optional(),
  lastfmPlayCount: z.number().nullable().optional(),
  instagramFollowers: z.number().nullable().optional(),
  facebookFollowers: z.number().nullable().optional(),
  tiktokFollowers: z.number().nullable().optional(),
  soundcloudFollowers: z.number().nullable().optional(),
}) satisfies z.Schema<Analytics>;

// Spotify track schema
export const spotifyTrackSchema = z.object({
  title: z.string(),
  trackId: z.string(),
  popularity: z.number(),
  platform: z.string(),
  spotifyUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  spotifyStreams: z.number().nullable(),
}) satisfies z.Schema<SpotifyTrack>;

// Array of tracks schema with minimum 1 track
export const spotifyTracksSchema = z.array(spotifyTrackSchema)
  .min(1, "At least one track is required");

// Schema for videos
export const videoSchema = z.object({
  title: z.string(),
  videoId: z.string(),
  platform: z.string(),
  viewCount: z.number(),
  likeCount: z.number().optional(),
  monthlyStreams: z.number().optional(),
  totalStreams: z.number().optional(),
  thumbnail: z.string().nullable(),
}) satisfies z.Schema<YoutubeVideo>;


export const similarArtistSchema = z.object({
  name: z.string(),
  imageUrl: z.string().nullable(),
  id: z.string(),
  genres: z.array(z.string()),
  match: z.number().nullable(),
  popularity: z.number().nullable(),
  selected: z.boolean().optional().nullable(),
}) satisfies z.Schema<SimilarArtist>;

export interface ArtistFormFull {
    artistInfo:   ArtistInfo;
    analytics: Analytics;
    videos: YoutubeVideoInfo[];
    tracks: SpotifyTrackInfo[];
    isSubmitting?: boolean;
    errors?: Record<string, string>;
  }


export const fullArtistSchema = z.object({
  artistInfo: artistSchema,
  analytics: analyticsSchema,
  videos: z.array(videoSchema),
  tracks: z.array(spotifyTrackSchema),
}) satisfies z.Schema<ArtistFormFull>;

// Infer types from schemas
export type ArtistBasic = z.infer<typeof artistBasicSchema>;
export type ArtistPlatform = z.infer<typeof artistPlatformSchema>;
export type ArtistSocial = z.infer<typeof artistSocialSchema>;
export type ArtistInfo = z.infer<typeof artistSchema>;
export type ArtistAnalytics = z.infer<typeof analyticsSchema>;
export type SpotifyTrackInfo = z.infer<typeof spotifyTrackSchema>;
export type YoutubeVideoInfo = z.infer<typeof videoSchema>;
export type ArtistFormState = z.infer<typeof fullArtistSchema>;