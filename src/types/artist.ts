import {ArtistInfo, Analytics, YoutubeVideoInfo, SpotifyTrackInfo, SimilarArtist} from "@/validations/artist-schema";


export interface ArtistFormState {
  artistInfo:   ArtistInfo;
  analytics: Analytics;
  videos: YoutubeVideoInfo[];
  tracks: SpotifyTrackInfo[];
  similarArtists: SimilarArtist[];
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export interface PlatformData {
  platform: string;
  followers: number;
  color: string;
}

export interface ArtistFanbaseData {
  name: string;
  platforms: PlatformData[];
  totalFollowers: number;
}