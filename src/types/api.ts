export interface SimilarArtist {
    name: string;
    match: string;
}

// export interface LastFmArtistInfo extends Array<SimilarArtist> {}

// export interface LastFmResponse {
//     similarartists: {
//         artist: LastFmArtistInfo;
//     };
// }

// export interface PreviewArtistResponse {
//   name: string
//   spotifyId: string | null
//   lastFmId?: string | null
//   youtubeChannelId: string | null
//   bio: string | null
//   genres: string[]
//   imageUrl: string | null
//   youtubeUrl?: string | null
//   spotifyUrl?: string | null
//   tiktokUrl?: string | null
//   instagramUrl?: string | null
//   similarArtists: SimilarArtist[]
//   topTracks?: any[]
//   artistVideos?: any[]
//   analytics?: {
//     lastFmMonthlyListeners?: number
//     lastfmPlayCount?: number
//     youtubeSubscribers?: number
//     youtubeTotalViews?: number
//     youtubeVideoCount?: number
//     spotifyMonthlyListeners?: number
//     spotifyFollowers?: number
//     spotifyPopularity?: number
//     instagramFollowers?: number
//     facebookFollowers?: number
//     tiktokFollowers?: number
//     soundcloudFollowers?: number
//   }
// } 


// export interface ArtistIngestionResponse {
//     musicbrainzId: string
//     lastfmPlayCount: number | null
//     lastfmListeners: number | null
//     youtubeChannelId: string | undefined
//     youtubeChannelStats: any
//     biography: string | null
//     genres?: string[]
//     imageUrl?: string | null
//     gender?: string | null
//     country?: string | null
//     activeYears?: {
//         begin: string | null
//         end: string | null
//     }
// }


// export interface SpotifyArtist {
//     name: string
//     spotifyId: string
//     imageUrl: string
//     genres: string[]
//     popularity: number
//     followers: number
// }