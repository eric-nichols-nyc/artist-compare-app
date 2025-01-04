"use client"

import { Artist } from "@/types"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { artistSchema, ArtistInfo } from "@/validations/artist-schema"
import { useArtistFormStore } from "@/stores/artist-form-store"

interface EditArtistSheetProps {
  artist: Artist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditArtistSheet({ artist, open, onOpenChange }: EditArtistSheetProps) {
    console.log('edit sheet artist', artist)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch, errors } = useArtistFormStore()
  const [formData, setFormData] = useState<Partial<ArtistInfo>>(artist || {})

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        country: artist.country,
        genres: artist.genres,
        imageUrl: artist.imageUrl,
        spotifyId: artist.spotifyId,
        youtubeChannelId: artist.youtubeChannelId,
        spotifyFollowers: artist.spotifyFollowers,
        monthlyListeners: artist.monthlyListeners,
        youtubeSubscribers: artist.youtubeSubscribers,
        instagramFollowers: artist.instagramFollowers,
        facebookFollowers: artist.facebookFollowers,
        tiktokFollowers: artist.tiktokFollowers,
        gender: artist.gender || '',
        bio: artist.bio || '',
        age: artist.age || null,
        birthDate: artist.birthDate || '',
        birthPlace: artist.birthPlace || '',
        nationality: artist.nationality || '',
        occupation: artist.occupation || ['musician'],
        instruments: artist.instruments || [],
        yearsActive: artist.yearsActive || '',
        labels: artist.labels || [],
        tiktokUrl: artist.tiktokUrl || '',
        instagramUrl: artist.instagramUrl || '',
        youtubeUrl: artist.youtubeUrl || '',
        viberateUrl: artist.viberateUrl || '',
        musicBrainzId: artist.musicBrainzId || '',
      })
    }
  }, [artist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate the form data
      const validatedData = artistSchema.parse(formData)
      
      const response = await fetch(`/api/admin/update-artist/${artist?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      })

      if (!response.ok) throw new Error('Failed to update artist')
      
      // Update the form store
      dispatch({
        type: 'UPDATE_ARTIST_INFO',
        payload: validatedData
      })

      toast.success('Artist updated successfully')
      onOpenChange(false)
    } catch (error) {
      if (error.errors) {
        // Handle Zod validation errors
        dispatch({
          type: 'SET_ERRORS',
          payload: error.errors.reduce((acc, err) => ({
            ...acc,
            [err.path.join('.')]: err.message
          }), {})
        })
        toast.error('Please check the form for errors')
      } else {
        toast.error('Failed to update artist')
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field: keyof ArtistInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field if it exists
    if (errors?.[field]) {
      dispatch({
        type: 'SET_ERRORS',
        payload: { ...errors, [field]: undefined }
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Artist</SheetTitle>
          <SheetDescription>
            Make changes to the artist profile here.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Basic Information</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  aria-invalid={!!errors?.name}
                />
                {errors?.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country"
                  value={formData.country || ''}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                  aria-invalid={!!errors?.country}
                />
                {errors?.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="genres">Genres</Label>
                <Input 
                  id="genres"
                  value={formData.genres?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('genres', e.target.value.split(',').map(g => g.trim()))}
                  placeholder="Enter genres, separated by commas"
                  aria-invalid={!!errors?.genres}
                />
                {errors?.genres && (
                  <p className="text-sm text-red-500">{errors.genres}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                  aria-invalid={!!errors?.imageUrl}
                />
                {errors?.imageUrl && (
                  <p className="text-sm text-red-500">{errors.imageUrl}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  aria-invalid={!!errors?.bio}
                />
                {errors?.bio && (
                  <p className="text-sm text-red-500">{errors.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input 
                    id="gender"
                    value={formData.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value)}
                    aria-invalid={!!errors?.gender}
                  />
                  {errors?.gender && (
                    <p className="text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleFieldChange('age', e.target.value ? parseInt(e.target.value) : null)}
                    aria-invalid={!!errors?.age}
                  />
                  {errors?.age && (
                    <p className="text-sm text-red-500">{errors.age}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input 
                    id="birthDate"
                    type="date"
                    value={formData.birthDate || ''}
                    onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                    aria-invalid={!!errors?.birthDate}
                  />
                  {errors?.birthDate && (
                    <p className="text-sm text-red-500">{errors.birthDate}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="birthPlace">Birth Place</Label>
                  <Input 
                    id="birthPlace"
                    value={formData.birthPlace || ''}
                    onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
                    aria-invalid={!!errors?.birthPlace}
                  />
                  {errors?.birthPlace && (
                    <p className="text-sm text-red-500">{errors.birthPlace}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input 
                  id="nationality"
                  value={formData.nationality || ''}
                  onChange={(e) => handleFieldChange('nationality', e.target.value)}
                  aria-invalid={!!errors?.nationality}
                />
                {errors?.nationality && (
                  <p className="text-sm text-red-500">{errors.nationality}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input 
                  id="occupation"
                  value={formData.occupation?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('occupation', e.target.value.split(',').map(o => o.trim()))}
                  placeholder="Enter occupations, separated by commas"
                  aria-invalid={!!errors?.occupation}
                />
                {errors?.occupation && (
                  <p className="text-sm text-red-500">{errors.occupation}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instruments">Instruments</Label>
                <Input 
                  id="instruments"
                  value={formData.instruments?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('instruments', e.target.value.split(',').map(i => i.trim()))}
                  placeholder="Enter instruments, separated by commas"
                  aria-invalid={!!errors?.instruments}
                />
                {errors?.instruments && (
                  <p className="text-sm text-red-500">{errors.instruments}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="yearsActive">Years Active</Label>
                <Input 
                  id="yearsActive"
                  value={formData.yearsActive || ''}
                  onChange={(e) => handleFieldChange('yearsActive', e.target.value)}
                  placeholder="e.g., 2010-present"
                  aria-invalid={!!errors?.yearsActive}
                />
                {errors?.yearsActive && (
                  <p className="text-sm text-red-500">{errors.yearsActive}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="labels">Record Labels</Label>
                <Input 
                  id="labels"
                  value={formData.labels?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('labels', e.target.value.split(',').map(l => l.trim()))}
                  placeholder="Enter labels, separated by commas"
                  aria-invalid={!!errors?.labels}
                />
                {errors?.labels && (
                  <p className="text-sm text-red-500">{errors.labels}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Social Media IDs */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Social Media IDs</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/images/spotify.svg" alt="Spotify" width={16} height={16} />
                  <Label>Spotify ID</Label>
                </div>
                <Input 
                  value={formData.spotifyId || ''}
                  onChange={(e) => handleFieldChange('spotifyId', e.target.value)}
                  aria-invalid={!!errors?.spotifyId}
                />
                {errors?.spotifyId && (
                  <p className="text-sm text-red-500">{errors.spotifyId}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/images/youtube-alt.svg" alt="YouTube" width={16} height={16} />
                  <Label>YouTube Channel ID</Label>
                </div>
                <Input 
                  value={formData.youtubeChannelId || ''}
                  onChange={(e) => handleFieldChange('youtubeChannelId', e.target.value)}
                  aria-invalid={!!errors?.youtubeChannelId}
                />
                {errors?.youtubeChannelId && (
                  <p className="text-sm text-red-500">{errors.youtubeChannelId}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/images/youtube-alt.svg" alt="YouTube" width={16} height={16} />
                  <Label>YouTube URL</Label>
                </div>
                <Input 
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => handleFieldChange('youtubeUrl', e.target.value)}
                  aria-invalid={!!errors?.youtubeUrl}
                />
                {errors?.youtubeUrl && (
                  <p className="text-sm text-red-500">{errors.youtubeUrl}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/images/tiktok.svg" alt="TikTok" width={16} height={16} />
                  <Label>TikTok URL</Label>
                </div>
                <Input 
                  value={formData.tiktokUrl || ''}
                  onChange={(e) => handleFieldChange('tiktokUrl', e.target.value)}
                  aria-invalid={!!errors?.tiktokUrl}
                />
                {errors?.tiktokUrl && (
                  <p className="text-sm text-red-500">{errors.tiktokUrl}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/images/instagram-alt.bb84a5f1.svg" alt="Instagram" width={16} height={16} />
                  <Label>Instagram URL</Label>
                </div>
                <Input 
                  value={formData.instagramUrl || ''}
                  onChange={(e) => handleFieldChange('instagramUrl', e.target.value)}
                  aria-invalid={!!errors?.instagramUrl}
                />
                {errors?.instagramUrl && (
                  <p className="text-sm text-red-500">{errors.instagramUrl}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Viberate URL</Label>
                <Input 
                  value={formData.viberateUrl || ''}
                  onChange={(e) => handleFieldChange('viberateUrl', e.target.value)}
                  aria-invalid={!!errors?.viberateUrl}
                />
                {errors?.viberateUrl && (
                  <p className="text-sm text-red-500">{errors.viberateUrl}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>MusicBrainz ID</Label>
                <Input 
                  value={formData.musicBrainzId || ''}
                  onChange={(e) => handleFieldChange('musicBrainzId', e.target.value)}
                  aria-invalid={!!errors?.musicBrainzId}
                />
                {errors?.musicBrainzId && (
                  <p className="text-sm text-red-500">{errors.musicBrainzId}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Analytics */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Analytics</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/spotify.svg" alt="Spotify" width={16} height={16} />
                    <Label>Spotify Followers</Label>
                  </div>
                  <Input 
                    type="number"
                    value={formData.spotifyFollowers || ''}
                    onChange={(e) => handleFieldChange('spotifyFollowers', parseInt(e.target.value))}
                    aria-invalid={!!errors?.spotifyFollowers}
                  />
                  {errors?.spotifyFollowers && (
                    <p className="text-sm text-red-500">{errors.spotifyFollowers}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/spotify.svg" alt="Spotify" width={16} height={16} />
                    <Label>Monthly Listeners</Label>
                  </div>
                  <Input 
                    type="number"
                    value={formData.monthlyListeners || ''}
                    onChange={(e) => handleFieldChange('monthlyListeners', parseInt(e.target.value))}
                    aria-invalid={!!errors?.monthlyListeners}
                  />
                  {errors?.monthlyListeners && (
                    <p className="text-sm text-red-500">{errors.monthlyListeners}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/youtube-alt.svg" alt="YouTube" width={16} height={16} />
                    <Label>YouTube Subscribers</Label>
                  </div>
                  <Input 
                    type="number"
                    value={formData.youtubeSubscribers || ''}
                    onChange={(e) => handleFieldChange('youtubeSubscribers', parseInt(e.target.value))}
                    aria-invalid={!!errors?.youtubeSubscribers}
                  />
                  {errors?.youtubeSubscribers && (
                    <p className="text-sm text-red-500">{errors.youtubeSubscribers}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/instagram-alt.bb84a5f1.svg" alt="Instagram" width={16} height={16} />
                    <Label>Instagram Followers</Label>
                  </div>
                  <Input 
                    type="number"
                    value={formData.instagramFollowers || ''}
                    onChange={(e) => handleFieldChange('instagramFollowers', parseInt(e.target.value))}
                    aria-invalid={!!errors?.instagramFollowers}
                  />
                  {errors?.instagramFollowers && (
                    <p className="text-sm text-red-500">{errors.instagramFollowers}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/facebook.svg" alt="Facebook" width={16} height={16} />
                    <Label>Facebook Followers</Label>
                  </div>
                  <Input 
                    type="number"
                    value={formData.facebookFollowers || ''}
                    onChange={(e) => handleFieldChange('facebookFollowers', parseInt(e.target.value))}
                    aria-invalid={!!errors?.facebookFollowers}
                  />
                  {errors?.facebookFollowers && (
                    <p className="text-sm text-red-500">{errors.facebookFollowers}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/tiktok.svg" alt="TikTok" width={16} height={16} />
                    <Label>TikTok Followers</Label>
                  </div>
                  <Input 
                    type="number"
                    value={formData.tiktokFollowers || ''}
                    onChange={(e) => handleFieldChange('tiktokFollowers', parseInt(e.target.value))}
                    aria-invalid={!!errors?.tiktokFollowers}
                  />
                  {errors?.tiktokFollowers && (
                    <p className="text-sm text-red-500">{errors.tiktokFollowers}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
} 