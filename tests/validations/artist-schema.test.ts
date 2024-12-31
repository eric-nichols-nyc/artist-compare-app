import { describe, it, expect } from 'vitest'
import { artistSchema } from '@/validations/artist-schema' 

describe('artistSchema', () => {
  it('validates a valid artist input', () => {
    const validArtist = {
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
    }

    const result = artistSchema.safeParse(validArtist)
    expect(result.success).toBe(true)
  })

  it('fails validation with missing required fields', () => {
    const invalidArtist = {
      name: "",  // Required, non-empty
      genres: [], // Required, min 1
    }

    const result = artistSchema.safeParse(invalidArtist)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['name'],
          message: 'Artist name is required'
        })
      )
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['genres'],
          message: 'At least one genre is required'
        })
      )
    }
  })

  it('allows null values for optional fields', () => {
    const artistWithNulls = {
      name: "Taylor Swift",
      genres: ["pop"],
      spotifyId: null,
      musicbrainzId: null,
      youtubeChannelId: null,
      bio: null,
      gender: null,
      country: null,
      age: null,
      imageUrl: null,
      youtubeUrl: null,
      spotifyUrl: null,
      tiktokUrl: null,
      instagramUrl: null,
    }

    const result = artistSchema.safeParse(artistWithNulls)
    expect(result.success).toBe(true)
  })
})