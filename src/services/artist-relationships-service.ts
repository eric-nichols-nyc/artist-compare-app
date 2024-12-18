import axios from 'axios';

interface ArtistRelationship {
  type: string;
  artistName: string;
  artistId: string;
  begin?: string;
  end?: string;
  attributes?: string[];
}

interface RelationshipsByType {
  collaborations: ArtistRelationship[];
  bandMembers: ArtistRelationship[];
  influences: ArtistRelationship[];
  tribute: ArtistRelationship[];
  support: ArtistRelationship[];
  covers: ArtistRelationship[];
  remixes: ArtistRelationship[];
  [key: string]: ArtistRelationship[];
}

export class ArtistRelationshipsService {
  private api;
  private lastRequestTime: number = 0;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://musicbrainz.org/ws/2',
      headers: {
        'User-Agent': 'ArtistComparisonApp/1.0.0 (your@email.com)',
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

  async searchArtist(artistName: string): Promise<string | null> {
    try {
      const searchData = await this.rateLimitedRequest('/artist', {
        query: artistName,
        fmt: 'json'
      });

      if (!searchData.artists?.length) return null;
      return searchData.artists[0].id;
    } catch (error) {
      console.error('Error searching artist:', error);
      return null;
    }
  }

  async getArtistRelationships(artistId: string): Promise<RelationshipsByType> {
    try {
      const data = await this.rateLimitedRequest(`/artist/${artistId}`, {
        inc: 'artist-rels+recordings+releases',
        fmt: 'json'
      });

      const relationships: RelationshipsByType = {
        collaborations: [],
        bandMembers: [],
        influences: [],
        tribute: [],
        support: [],
        covers: [],
        remixes: []
      };

      if (!data.relations) return relationships;

      data.relations.forEach((rel: any) => {
        if (rel.type && rel.artist) {
          const relationship: ArtistRelationship = {
            type: rel.type,
            artistName: rel.artist.name,
            artistId: rel.artist.id,
            begin: rel['begin-date'],
            end: rel['end-date'],
            attributes: rel.attributes
          };

          // Categorize relationships
          switch (rel.type.toLowerCase()) {
            case 'member of band':
            case 'member':
              relationships.bandMembers.push(relationship);
              break;
            case 'collaboration':
              relationships.collaborations.push(relationship);
              break;
            case 'influenced':
            case 'influenced by':
              relationships.influences.push(relationship);
              break;
            case 'tribute':
            case 'cover':
              relationships.tribute.push(relationship);
              break;
            case 'supporting musician':
              relationships.support.push(relationship);
              break;
            case 'remix':
              relationships.remixes.push(relationship);
              break;
            default:
              // Create category if it doesn't exist
              if (!relationships[rel.type]) {
                relationships[rel.type] = [];
              }
              relationships[rel.type].push(relationship);
          }
        }
      });

      return relationships;
    } catch (error) {
      console.error('Error fetching artist relationships:', error);
      throw error;
    }
  }

  async compareArtistRelationships(artist1Name: string, artist2Name: string) {
    try {
      // Get artist IDs
      const [artist1Id, artist2Id] = await Promise.all([
        this.searchArtist(artist1Name),
        this.searchArtist(artist2Name)
      ]);

      if (!artist1Id || !artist2Id) {
        throw new Error('One or both artists not found');
      }

      // Get relationships for both artists
      const [artist1Rels, artist2Rels] = await Promise.all([
        this.getArtistRelationships(artist1Id),
        this.getArtistRelationships(artist2Id)
      ]);

      // Find common relationships
      const commonRelationships = {
        collaborators: this.findCommonArtists(
          artist1Rels.collaborations,
          artist2Rels.collaborations
        ),
        influences: this.findCommonArtists(
          artist1Rels.influences,
          artist2Rels.influences
        ),
        bandConnections: this.findCommonArtists(
          artist1Rels.bandMembers,
          artist2Rels.bandMembers
        ),
        remixers: this.findCommonArtists(
          artist1Rels.remixes,
          artist2Rels.remixes
        )
      };

      return {
        artist1: {
          name: artist1Name,
          relationships: artist1Rels
        },
        artist2: {
          name: artist2Name,
          relationships: artist2Rels
        },
        commonConnections: commonRelationships
      };
    } catch (error) {
      console.error('Error comparing artist relationships:', error);
      throw error;
    }
  }

  private findCommonArtists(
    relations1: ArtistRelationship[],
    relations2: ArtistRelationship[]
  ): ArtistRelationship[] {
    const artistIds1 = new Set(relations1.map(rel => rel.artistId));
    return relations2.filter(rel => artistIds1.has(rel.artistId));
  }
}