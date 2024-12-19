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
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;
    }

    public static async searchArtist(artistName: string) {
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

        // get similar artists
        const similarArtistsResponse = await fetch(
            `https://customer.api.soundcharts.com/api/v2/artist/11e81bcc-9c1c-ce38-b96b-a0369fe50396/related?offset=0&limit=10`,
            {
                headers: {
                    'x-app-id': 'soundcharts',
                    'x-api-key': 'soundcharts'
                }
            }
        );

    
       

        const similarArtistsData = await similarArtistsResponse.json();
        console.log('similarArtistsData', similarArtistsData);

        // get top tracks
        const topTracksResponse = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );  

        const topTracksData = await topTracksResponse.json();
        // send all data in the response
        return {
            artist: data.artists.items[0],
            topTracks: topTracksData.tracks
        };
    }

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