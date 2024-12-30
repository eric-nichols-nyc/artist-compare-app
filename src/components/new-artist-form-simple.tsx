"use client"

import { useState } from "react"
import { Loader2, Search, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NewArtistFormSimple() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    spotifyId: "",
    lastFmId: "",
    youtubeChannelId: "",
    bio: "",
    genres: [] as string[],
    imageUrl: "",
    youtubeUrl: "",
    spotifyUrl: "",
    tiktokUrl: "",
    instagramUrl: "",
    similarArtists: [] as { name: string; match: string }[],
    topTracks: [] as any[],
    artistVideos: [] as any[],
    analytics: null as any
  })

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      console.log('Submitting:', formData)

      const response = await fetch("/api/admin/add-artist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artist: formData }),
      })

      if (!response.ok) {
        throw new Error("Failed to create artist")
      }

      toast.success("Artist created successfully")
      // Reset form
      setFormData({
        name: "",
        spotifyId: "",
        lastFmId: "",
        youtubeChannelId: "",
        bio: "",
        genres: [],
        imageUrl: "",
        youtubeUrl: "",
        spotifyUrl: "",
        tiktokUrl: "",
        instagramUrl: "",
        similarArtists: [],
        topTracks: [],
        artistVideos: [],
        analytics: null
      })
      setShowFullForm(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to create artist")
    } finally {
      setLoading(false)
    }
  }

  // Search artist function
  const handleSearch = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams(searchParams)
      params.set("name", formData.name)
      router.push(`?${params.toString()}`)

      const response = await fetch(`/api/admin/preview-artist?name=${encodeURIComponent(formData.name)}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch artist details")
      }

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        ...data,
        analytics: data.analytics || null
      }))
      setShowFullForm(true)
    } catch (error) {
      toast.error("Failed to fetch artist details")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Artist</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Artist name"
            />
          </div>

          {!showFullForm ? (
            <Button type="button" onClick={handleSearch} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!loading && <Search className="mr-2 h-4 w-4" />}
              Search Artist
            </Button>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium">Biography</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Artist biography"
                      rows={5}
                    />
                  </div>

                  {/* Platform IDs */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Spotify ID</label>
                      <Input
                        value={formData.spotifyId}
                        onChange={(e) => handleInputChange('spotifyId', e.target.value)}
                        placeholder="Spotify ID"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last.fm ID</label>
                      <Input
                        value={formData.lastFmId}
                        onChange={(e) => handleInputChange('lastFmId', e.target.value)}
                        placeholder="Last.fm ID"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">YouTube Channel ID</label>
                      <Input
                        value={formData.youtubeChannelId}
                        onChange={(e) => handleInputChange('youtubeChannelId', e.target.value)}
                        placeholder="YouTube Channel ID"
                      />
                    </div>
                  </div>

                  {/* Social URLs */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Spotify URL</label>
                      <Input
                        value={formData.spotifyUrl}
                        onChange={(e) => handleInputChange('spotifyUrl', e.target.value)}
                        placeholder="Spotify profile URL"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">YouTube URL</label>
                      <Input
                        value={formData.youtubeUrl}
                        onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                        placeholder="YouTube channel URL"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">TikTok URL</label>
                      <Input
                        value={formData.tiktokUrl}
                        onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                        placeholder="TikTok profile URL"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instagram URL</label>
                      <Input
                        value={formData.instagramUrl}
                        onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                        placeholder="Instagram profile URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Genres */}
                  <div>
                    <label className="text-sm font-medium">Genres</label>
                    <Input
                      value={formData.genres.join(", ")}
                      onChange={(e) => {
                        const genres = e.target.value
                          .split(",")
                          .map(genre => genre.trim())
                          .filter(genre => genre !== "")
                        handleInputChange('genres', genres)
                      }}
                      placeholder="Enter genres (comma-separated)"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="Image URL"
                    />
                    {formData.imageUrl && (
                      <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border">
                        <Image
                          src={formData.imageUrl}
                          alt="Artist preview"
                          fill
                          className={cn("object-cover", "transition-opacity duration-400")}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder-image.jpg"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Similar Artists */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Similar Artists</CardTitle>
                  <CardDescription>Artists with similar style or genre</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {formData.similarArtists.map((artist, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Input
                            placeholder="Artist name"
                            value={artist.name}
                            onChange={(e) => {
                              const newArtists = [...formData.similarArtists]
                              newArtists[index] = { ...artist, name: e.target.value }
                              handleInputChange('similarArtists', newArtists)
                            }}
                          />
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            className="w-24"
                            placeholder="Match %"
                            value={Number(artist.match).toFixed(2)}
                            onChange={(e) => {
                              let value = parseFloat(e.target.value)
                              if (!e.target.value.includes('.')) {
                                value = value === 1 ? 1 : 0
                              }
                              value = Math.min(Math.max(value || 0, 0), 1)
                              value = Math.round(value * 100) / 100
                              
                              const newArtists = [...formData.similarArtists]
                              newArtists[index] = { ...artist, match: value.toString() }
                              handleInputChange('similarArtists', newArtists)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Artist
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={handleSearch}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {!loading && <RefreshCw className="mr-2 h-4 w-4" />}
                  Refresh Data
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 