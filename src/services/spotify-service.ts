import { unstable_cache } from "next/cache";
import { LastFmArtistInfo, LastFmResponse } from "@/types";
import { SimilarSpotifyArtistWithMatch } from "@/types";

export class SpotifyService {
    private static getAccessToken = unstable_cache(
        async (): Promise<string> => {
            const clientId = process.env.NEXT_PUBLIC_SPOTIFY_ID;
            const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_SECRET;
            
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
                },
                body: 'grant_type=client_credentials',
            });

            const data = await response.json();
            return data.access_token;
        },
        ['spotify-access-token'],
        { tags: ['spotify-access-token'], revalidate: 3600 } // Cache for 1 hour
    );

    public static searchArtist = unstable_cache(async (artistName: string) => {
        const accessToken = await this.getAccessToken();
        
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const data = await response.json();
        if (!data.artists?.items?.length) {
            throw new Error('Artist not found');
        }
        console.log('searchArtist = ', data)

        const artistId = data.artists.items[0].id;

   
        return artistId;

    },['spotify-search-artist'], { tags: ['spotify-search-artist'], revalidate: 60 * 60 * 24 });

    public static getLastFmSimilarArtistInfo = unstable_cache(async (artistName: string): Promise<LastFmArtistInfo> => {
        const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
        try {
            const response = await fetch(
                `http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`
            );
            const data = await response.json() as LastFmResponse;
            return data.similarartists.artist;
        } catch (error) {
            console.error('Error fetching Last.fm artist info:', error);
            throw error;
        }
    }, ['lastfm-similar-artist-info'], { tags: ['lastfm-similar-artist-info'], revalidate: 60 * 60 * 24 });

    public static getSimilarSpotifyArtists = unstable_cache(async (spotifyIds: string[]) => {
      
        const accessToken = await this.getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/artists?ids=${spotifyIds.join(',')}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.json();
    }, ['spotify-similar-artists'], { tags: ['spotify-similar-artists'], revalidate: 60 * 60 * 24 });


    public static getSimilarArtists = unstable_cache(async (artistName:   string): Promise<SimilarSpotifyArtistWithMatch[]> => {
        const lastFmSimilarArtists = await this.getLastFmSimilarArtistInfo(artistName);
        const artists = lastFmSimilarArtists.slice(0, 10).map((artist) => artist.name);
        console.log('artists', artists);
        // creae promise.all to get the spotify ids
        const spotifyIds = await Promise.all(artists.map(async (artist) => {
            const spotifyId = await SpotifyService.searchArtist(artist);
            return spotifyId;
        }));
        console.log('spotifyIds', spotifyIds);

        const similarSpotifyArtists = await SpotifyService.getSimilarSpotifyArtists(spotifyIds);
        // add match to the similarSpotifyArtists
        const similarSpotifyArtistsWithMatch = similarSpotifyArtists.artists.map((artist: SimilarSpotifyArtistWithMatch, index: number) => ({
            ...artist,
            match: lastFmSimilarArtists[index].match
        }));
        return similarSpotifyArtistsWithMatch;
    },['spotify-similar-artists'], { tags: ['spotify-similar-artists'], revalidate: 60 * 60 * 24 });

    public static async getArtistData(artistId: string) {
        const accessToken = await this.getAccessToken();
        
        const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return response.json();
    }

    public static getArtistTopTracks = unstable_cache(
        async (artistId: string) => {
            const accessToken = await this.getAccessToken();
            
            const response = await fetch(
                `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            const data = await response.json();
            return data.tracks || [];
        },
        ['spotify-top-tracks'],
        { tags: ['spotify-top-tracks'], revalidate: 60 * 60 * 24 }
    );
} 