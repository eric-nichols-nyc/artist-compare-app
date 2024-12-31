import { describe, it, expect } from 'vitest';
import { ValidationService } from '../validation-service';
import { ArtistFormState } from '@/validations/artist-schema';
import { fullArtistSchema } from '@/validations/artist-schema';

describe('ValidationService', () => {
  it('should validate a valid form submission', async () => {
    const validFormData: ArtistFormState = {
      artistInfo: {
        name: "Taylor Swift",
        spotifyId: "06HL4z0CvFAxyc27GXpf02",
        musicbrainzId: "20244d07-534f-4eff-b4d4-930878889970",
        youtubeChannelId: "UCqECaJ8Gagnn7YCbPEzWH6g",
        bio: "Some bio text",
        genres: ["pop", "country"],
        gender: "female",
        country: "US",
        age: "34",
        imageUrl: "https://example.com/image.jpg",
        youtubeUrl: "https://youtube.com/channel/123",
        spotifyUrl: "https://open.spotify.com/artist/123",
        tiktokUrl: null,
        instagramUrl: "https://instagram.com/taylorswift",
        viberateUrl: null
      },
      analytics: {
        spotifyFollowers: 1000000,
        spotifyPopularity: 90,
        spotifyMonthlyListeners: 5000000,
        youtubeSubscribers: 2000000,
        youtubeTotalViews: 10000000,
      },
      videos: [{
        name: "Test Video",
        videoId: "123456",
        platform: "youtube",
        viewCount: 1000000,
        likeCount: 50000,
        commentCount: 1000,
        thumbnail: "https://example.com/thumb.jpg",
        publishedAt: "2024-01-01T00:00:00Z"
      }],
      tracks: [{
        name: "Test Track",
        trackId: "track123",
        platform: "spotify",
        popularity: 80,
        previewUrl: "https://example.com/preview",
        albumImageUrl: "https://example.com/album.jpg",
        spotifyStreams: 1000000
      }],
      similarArtists: [{
        id: "artist123",
        name: "Similar Artist",
        imageUrl: "https://example.com/artist.jpg",
        genres: ["pop"],
        match: 0.8,
        popularity: 75,
        selected: true
      }]
    };

    console.log('Testing with data:', JSON.stringify(validFormData, null, 2));
    
    const parsed = await fullArtistSchema.safeParseAsync(validFormData);
    if (!parsed.success) {
      console.log('Schema validation errors:', parsed.error.errors);
      parsed.error.errors.forEach(error => {
        console.log(`Error at path ${error.path.join('.')}: ${error.message}`);
      });
    }

    const result = await ValidationService.validateForm(validFormData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeNull();
  });

  it('should return validation errors for invalid form data', async () => {
    const invalidFormData: ArtistFormState = {
      artistInfo: {
        name: "", // Invalid: empty name
        spotifyId: null,
        musicbrainzId: null,
        youtubeChannelId: null,
        bio: null,
        genres: [], // Invalid: empty genres array
        gender: null,
        country: null,
        age: null,
        imageUrl: null,
        youtubeUrl: null,
        spotifyUrl: null,
        tiktokUrl: null,
        instagramUrl: null,
        viberateUrl: null
      },
      analytics: {
        spotifyFollowers: null,
        spotifyPopularity: null,
        spotifyMonthlyListeners: null,
        youtubeSubscribers: null,
        youtubeTotalViews: null,
        lastfmListeners: null,
        lastfmPlayCount: null,
        instagramFollowers: null,
        facebookFollowers: null,
        tiktokFollowers: null,
        soundcloudFollowers: null
      },
      videos: [],
      tracks: [],
      similarArtists: []
    } as ArtistFormState;

    const result = await ValidationService.validateForm(invalidFormData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toBeTruthy();
    expect(result.errors?.['artistInfo.name']).toBeDefined();
    expect(result.errors?.['artistInfo.genres']).toBeDefined();
  });

  it('should handle unexpected errors during validation', async () => {
    // @ts-ignore - intentionally passing invalid data to trigger error
    const result = await ValidationService.validateForm(null);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({ 
      general: 'An error occurred during validation' 
    });
  });
}); 