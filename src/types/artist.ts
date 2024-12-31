import { ArtistTopTrack, ArtistVideo, ArtistSimilarity } from "@prisma/client";
import { Analytics } from "@/validations/artist-form-schema";
import { ArtistInfo } from "@/validations/artist-form-schema";


export interface ArtistFormState {
  artistInfo:   ArtistInfo;
  analytics: Analytics;
  videos: ArtistVideo[];
  tracks: ArtistTopTrack[];
  similarArtists: ArtistSimilarity[];
}
