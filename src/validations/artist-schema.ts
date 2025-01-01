import z from "zod";
import { Prisma } from "@prisma/client"
import { SpotifyTrack } from "@/types";

export type FormAction =
  | { type: 'UPDATE_ARTIST_INFO'; payload: Partial<ArtistInfo> }
  | { type: 'SELECT_ARTIST'; payload: SpotifyArtist }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<Analytics> }
  | { type: 'UPDATE_YOUTUBE_VIDEOS'; payload: YoutubeVideoInfo[] }
  | { type: 'UPDATE_TRACKS'; payload: SpotifyTrack[] }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'UPDATE_SIMILAR_ARTIST_SELECTION'; payload: SimilarArtist[] }
  | { type: 'RESET_FORM' }
  | { type: 'CANCEL_ARTIST_SELECTION' };


export interface Analytics {
    spotifyFollowers?: number | null;
    spotifyPopularity?: number | null;
    spotifyMonthlyListeners?: number | null;
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
    spotifyId: string | null;
    imageUrl: string | null;
    genres: string[];
}

export interface SpotifyArtist extends BasicArtistInfo {
    followers: number | null;
    popularity: number | null;
}

export interface ArtistFull extends BasicArtistInfo {
    bio: string | null;
    genres: string[];
    musicbrainzId: string | null;
    country: string | null;
    gender: string | null;
    age: string | null;
    youtubeChannelId: string | null;
    imageUrl: string | null;
    spotifyUrl: string | null;
    youtubeUrl: string | null;
    tiktokUrl: string | null;
    instagramUrl: string | null;
    viberateUrl: string | null;
  }

  export interface YoutubeVideo {
    name: string;
    videoId: string;
    platform: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnail: string | null;
    publishedAt: string;
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
  age: z.string().nullable(),
}) satisfies z.Schema<Pick<ArtistFull, "name" | "bio" | "genres" | "country" | "gender" | "age">>;

// Platform IDs
export const artistPlatformSchema = z.object({
  spotifyId: z.string().nullable(),
  musicbrainzId: z.string().nullable(),
  youtubeChannelId: z.string().nullable(),
}) satisfies z.Schema<Pick<ArtistFull, "spotifyId" | "musicbrainzId" | "youtubeChannelId">>;

// Social URLs
export const artistSocialSchema = z.object({
  imageUrl: z.string().nullable(),
  youtubeUrl: z.string().nullable(),
  spotifyUrl: z.string().nullable(),
  tiktokUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
  viberateUrl: z.string().nullable(),
}) satisfies z.Schema<Pick<ArtistFull, "imageUrl" | "youtubeUrl" | "spotifyUrl" | "tiktokUrl" | "instagramUrl">>;

// Combined schema for full artist validation
export const artistSchema = artistBasicSchema
  .merge(artistPlatformSchema)
  .merge(artistSocialSchema) satisfies z.Schema<Prisma.ArtistCreateInput>;

// Analytics schema remains separate
export const analyticsSchema = z.object({
  spotifyFollowers: z.number().nullable().optional(),
  spotifyPopularity: z.number().nullable().optional(),
  spotifyMonthlyListeners: z.number().nullable().optional(),
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
  name: z.string(),
  trackId: z.string(),
  platform: z.string(),
  popularity: z.number(),
  previewUrl: z.string().nullable(),
  externalUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  spotifyStreams: z.number().nullable(),
}) satisfies z.Schema<SpotifyTrack>;

// Array of tracks schema with minimum 1 track
export const spotifyTracksSchema = z.array(spotifyTrackSchema)
  .min(1, "At least one track is required");

// Schema for videos
export const videoSchema = z.object({
  name: z.string(),
  videoId: z.string(),
  platform: z.string(),
  viewCount: z.number(),
  likeCount: z.number(),
  commentCount: z.number(),
  thumbnail: z.string().nullable(),
  publishedAt: z.string(),
}) satisfies z.Schema<YoutubeVideo>;


export const SimilarArtistSchema = z.object({
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
    similarArtists: SimilarArtist[];
    isSubmitting?: boolean;
    errors?: Record<string, string>;
  }


export const fullArtistSchema = z.object({
  artistInfo: artistSchema,
  analytics: analyticsSchema,
  videos: z.array(videoSchema),
  tracks: z.array(spotifyTrackSchema),
  similarArtists: z.array(SimilarArtistSchema),
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