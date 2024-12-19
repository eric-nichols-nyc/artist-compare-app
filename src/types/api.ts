export interface SimilarArtist {
    name: string;
    match: string;
}

export interface LastFmArtistInfo extends Array<SimilarArtist> {}

export interface LastFmResponse {
    similarartists: {
        artist: LastFmArtistInfo;
    };
}

export interface PreviewArtistResponse {
  name: string
  spotifyId: string | null
  lastFmId?: string | null
  youtubeChannelId: string | null
  bio: string | null
  genres: string[]
  imageUrl: string | null
  youtubeUrl?: string | null
  spotifyUrl?: string | null
  tiktokUrl?: string | null
  instagramUrl?: string | null
  similarArtists: SimilarArtist[]
  topTracks?: any[]
  artistVideos?: any[]
  analytics?: {
    monthlyListeners?: number
    youtubeSubscribers?: number
    youtubeTotalViews?: number
    lastfmPlayCount?: number
    spotifyFollowers?: number
    spotifyPopularity?: number
    topYoutubeVideo?: any
    topSpotifyTrack?: any
    instagramFollowers?: number
    facebookFollowers?: number
    tiktokFollowers?: number
    soundcloudFollowers?: number
  }
} 
