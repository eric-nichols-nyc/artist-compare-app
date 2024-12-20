import { unstable_cache } from "next/cache";
export class SpotifyService {
    private static async getAccessToken(): Promise<string> {
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
    }

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

        const artistId = data.artists.items[0].id;

   
        return artistId;

    },['spotify-search-artist'], { tags: ['spotify-search-artist'], revalidate: 60 * 60 * 24 });

    public getSimilarArtists = unstable_cache(async (artistId: string) => {
        const accessToken = await (this.constructor as typeof SpotifyService).getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
    },['spotify-similar-artists'], { tags: ['spotify-similar-artists'], revalidate: 60 * 60 * 24 });

    public getTopTracks = unstable_cache(async (artistId: string) => {
        const accessToken = await (this.constructor as typeof SpotifyService).getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const topTracksData = await response.json();
        return topTracksData.tracks;
    },['spotify-top-tracks'], { tags: ['spotify-top-tracks'], revalidate: 60 * 60 * 24 });

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

    public static async getArtistTopTracks(artistId: string) {
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
    }
} 