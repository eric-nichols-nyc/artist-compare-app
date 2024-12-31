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