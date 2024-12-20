// services/musicbrainz-service.ts
import axios from 'axios';
import { unstable_cache } from 'next/cache';
interface MusicBrainzArtist {
  id: string;
  name: string;
  country?: string;
  'life-span'?: {
    begin?: string;
    end?: string;
  };
  genres?: Array<{ name: string }>;
  gender?: string;
  tags?: Array<{ name: string }>;
  disambiguation?: string;
  score?: number;
}

interface ArtistDetails {
  id: string;
  name: string;
  country: string | null;
  genres: string[];
  gender: string | null;
  tags?: string[];
  activeYears: {
    begin: string | null;
    end: string | null;
  };
  disambiguation: string | null;
}

export class MusicBrainzService {
  private api;
  private lastRequestTime: number = 0;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://musicbrainz.org/ws/2',
      headers: {
        'User-Agent': 'ArtistComparisonApp/1.0.0 (ebn646@gmail.com)',
        'Accept': 'application/json'
      }
    });
  }

  private async rateLimitedRequest(url: string, params: any): Promise<any> {
    // Ensure 1 second between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
    }

    try {
      const response = await this.api.get(url, { params });
      this.lastRequestTime = Date.now();
      return response.data;
    } catch (error) {
      console.error('MusicBrainz API error:', error);
      throw error;
    }
  }

  public getArtistDetails = unstable_cache(async (artistName: string): Promise<ArtistDetails | null> => {
    try {
      // Search for artist
      const searchData = await this.rateLimitedRequest('/artist', {
        query: artistName,
        fmt: 'json'
      });

      if (!searchData.artists?.length) {
        return null;
      }

      const artist = searchData.artists[0] as MusicBrainzArtist;
      console.log('=========mbartist', artist);
      // Get detailed information
      const detailedData = await this.rateLimitedRequest(`/artist/${artist.id}`, {
        inc: 'genres+url-rels',
        fmt: 'json'
      });

      return {
        id: artist.id,
        name: artist.name,
        country: artist.country || null,
        gender: artist.gender || null,
        genres: (detailedData.genres || []).map((g: { name: string }) => g.name),
        activeYears: {
          begin: artist['life-span']?.begin || null,
          end: artist['life-span']?.end || null
        },
        disambiguation: artist.disambiguation || null
      };
    } catch (error) {
      console.error('Error fetching artist details:', error);
      return null;
    }
  }, ['musicbrainz-artist-details'], { tags: ['musicbrainz-artist-details'], revalidate: 60 * 60 * 24 });

  async getCommonCollaborators(artist1Id: string, artist2Id: string): Promise<string[]> {
    try {
      const [relations1, relations2] = await Promise.all([
        this.rateLimitedRequest(`/artist/${artist1Id}`, {
          inc: 'artist-rels',
          fmt: 'json'
        }),
        this.rateLimitedRequest(`/artist/${artist2Id}`, {
          inc: 'artist-rels',
          fmt: 'json'
        })
      ]);

      const collaborators1 = new Set(
        relations1.relations
          ?.filter((rel: any) => rel.type === 'collaboration')
          .map((rel: any) => rel.artist.name)
      );

      const commonCollaborators = relations2.relations
        ?.filter((rel: any) => 
          rel.type === 'collaboration' && 
          collaborators1.has(rel.artist.name)
        )
        .map((rel: any) => rel.artist.name);

      return commonCollaborators || [];
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      return [];
    }
  }
}