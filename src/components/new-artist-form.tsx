"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { Loader2, Search, Music, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { artistSchema, type ArtistFormValues } from "@/lib/validations/artist"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { PreviewArtistResponse } from "@/types/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardDescription } from "./ui/card"
import { Separator } from "./ui/separator"

interface ArtistAnalytics {
  monthlyListeners?: number
  youtubeSubscribers?: number
  youtubeTotalViews?: number
  lastfmPlayCount?: number
  spotifyFollowers?: number
  spotifyPopularity?: number
  topYoutubeVideo?: any
  topSpotifyTrack?: any
  instagramFollowers?: number
  facebookFollowers?: number
  tiktokFollowers?: number
  soundcloudFollowers?: number
}

interface SimilarArtist {
  name: string;
  match: string;
}

interface TopTrack {
  name: string;
  popularity: number;
  previewUrl?: string;
  albumImageUrl?: string;
  spotify_streams?: number;
}

interface ArtistVideo {
  title: string;
  viewCount: number;
  url?: string;
  thumbnail?: string;
}

export default function NewArtistForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)
  const [analytics, setAnalytics] = useState<ArtistAnalytics | null>(null)
  const [artistData, setArtistData] = useState<PreviewArtistResponse | null>(null)

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: searchParams.get("name") || "",
      spotifyId: null,
      lastFmId: null,
      youtubeChannelId: null,
      bio: null,
      genres: [],
      imageUrl: null,
      youtubeUrl: null,
      spotifyUrl: null,
      tiktokUrl: null,
      instagramUrl: null,
      similarArtists: [],
      topTracks: [],
      artistVideos: [],
    },
  })

  useEffect(() => {
    const nameFromUrl = searchParams.get("name")
    if (nameFromUrl && !showFullForm) {
      onSearchArtist({ name: nameFromUrl })
    }
  }, [searchParams])

  async function onSearchArtist(data: { name: string }) {
    try {
      const start = performance.now()
      setLoading(true)
      
      const params = new URLSearchParams(searchParams)
      params.set("name", data.name)
      router.push(`?${params.toString()}`)

      const response = await fetch(`/api/admin/preview-artist?name=${encodeURIComponent(data.name)}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch artist details")
      }

      const artistData: PreviewArtistResponse & { analytics?: ArtistAnalytics } = await response.json()
      // map the images
      artistData.topTracks = artistData?.topTracks?.map((track: any) => ({
        ...track,
        albumImageUrl: track.album.images[0].url,
      }))
      setArtistData(artistData)
      const end = performance.now()
      console.log(`Time taken: ${end - start} milliseconds`)
      console.log('artistData ', artistData)
      
      form.reset({
        name: data.name,
        spotifyId: artistData.spotifyId,
        lastFmId: artistData.lastFmId,
        youtubeChannelId: artistData.youtubeChannelId,
        bio: artistData.bio,
        genres: artistData.genres,
        imageUrl: artistData.imageUrl,
        youtubeUrl: artistData.youtubeUrl,
        spotifyUrl: artistData.spotifyUrl,
        tiktokUrl: artistData.tiktokUrl,
        instagramUrl: artistData.instagramUrl,
        similarArtists: artistData.similarArtists || [],
        topTracks: artistData.topTracks || [],
        artistVideos: artistData.artistVideos || [],
      })

      setAnalytics(artistData.analytics || null)

      setShowFullForm(true)
      toast.success("Artist details fetched", {
        description: "Please review and edit the information before saving.",
      })
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Failed to fetch artist details. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: ArtistFormValues) {
    try {
      setLoading(true)
      
      const formattedData = {
        ...data,
        spotifyId: data.spotifyId || null,
        lastFmId: data.lastFmId || null,
        youtubeChannelId: data.youtubeChannelId || null,
        bio: data.bio || null,
        imageUrl: data.imageUrl || null,
        youtubeUrl: data.youtubeUrl || null,
        spotifyUrl: data.spotifyUrl || null,
        tiktokUrl: data.tiktokUrl || null,
        instagramUrl: data.instagramUrl || null,
      }

      // add a check to see if the artist already exists
      const existingArtist = await fetch(`/api/admin/add-artist?name=${encodeURIComponent(data.name)}`, {
        method: "GET",
      })

      if (existingArtist.ok) {
        throw new Error("Artist already exists")
      }

      const response = await fetch("/api/admin/add-artist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error("Failed to create artist")
      }

      toast.success("Artist created successfully", {
        description: "The artist has been added to the database.",
      })
      
      form.reset()
      setShowFullForm(false)
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Failed to create artist. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onUpdate(data: ArtistFormValues) {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/update-artist/${data.spotifyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update artist")
      }

      const updatedData = await response.json()
      setArtistData(updatedData)
      
      toast.success("Artist updated successfully", {
        description: "The artist has been updated in the database.",
      })

    } catch (error) {
      toast.error("Something went wrong", {
        description: "Failed to update artist. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onYoutubeChannelUpdate(channelId: string) {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/update-artist/${artistData?.spotifyId}/youtube`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeChannelId: channelId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update YouTube data")
      }

      const updatedData = await response.json()
      console.log('updatedData ', updatedData)
      return
      if(Array.isArray(updatedData)) {
        updatedData.map((video: any) => ({
          ...video,
          thumbnail: video.snippet.thumbnailUrl,
        }))
      }
      setArtistData((prev) => prev ? {
        ...prev,
        artistVideos: updatedData,
      } : null)
      
      toast.success("YouTube data updated", {
        description: "The artist's YouTube videos have been updated.",
      })

    } catch (error) {
      toast.error("Something went wrong", {
        description: "Failed to update YouTube data. Please try again.",
      })
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(showFullForm ? onSubmit : onSearchArtist)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!showFullForm ? (
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {!loading && <Search className="mr-2 h-4 w-4" />}
                  Search Artist
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field: { value, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel>Biography</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Artist biography"
                                {...fieldProps}
                                value={value ?? ""}
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="spotifyId"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Spotify ID</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Spotify ID" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastFmId"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Last.fm ID</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Last.fm ID" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="youtubeChannelId"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>YouTube Channel ID</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="YouTube Channel ID" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="spotifyUrl"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Spotify URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Spotify profile URL" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="youtubeUrl"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>YouTube URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="YouTube channel URL" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tiktokUrl"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>TikTok URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="TikTok profile URL" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="instagramUrl"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Instagram URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Instagram profile URL" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="genres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genres</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter genres (comma-separated)"
                                value={field.value.join(", ")}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const genres = value
                                    .split(",")
                                    .map((genre) => genre.trim())
                                    .filter((genre) => genre !== "");
                                  field.onChange(genres);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field: { value, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Image URL" 
                                  {...fieldProps}
                                  value={value ?? ""} 
                                />
                              </FormControl>
                              <FormMessage />
                              {value && (
                                <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border">
                                  <Image
                                    src={value}
                                    alt="Artist preview"
                                    fill
                                    className={cn(
                                      "object-cover",
                                      "transition-opacity duration-400",
                                    )}
                                    onError={(e) => {
                                      // Handle image load error
                                      const target = e.target as HTMLImageElement
                                      target.src = "/placeholder-image.jpg" // Add a placeholder image
                                    }}
                                  />
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>

                      {analytics && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Artist Analytics</CardTitle>
                            <CardDescription>Current statistics across platforms</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Spotify</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm text-muted-foreground">Followers</label>
                                    <Input
                                      type="number"
                                      value={analytics.spotifyFollowers || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        spotifyFollowers: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-muted-foreground">Popularity</label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={analytics.spotifyPopularity || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        spotifyPopularity: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">YouTube</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm text-muted-foreground">Subscribers</label>
                                    <Input
                                      type="number"
                                      value={analytics.youtubeSubscribers || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        youtubeSubscribers: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-muted-foreground">Total Views</label>
                                    <Input
                                      type="number"
                                      value={analytics.youtubeTotalViews || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        youtubeTotalViews: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Last.fm</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm text-muted-foreground">Monthly Listeners</label>
                                    <Input
                                      type="number"
                                      value={analytics.monthlyListeners || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        monthlyListeners: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-muted-foreground">Play Count</label>
                                    <Input
                                      type="number"
                                      value={analytics.lastfmPlayCount || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        lastfmPlayCount: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Social Media</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm text-muted-foreground">Instagram Followers</label>
                                    <Input
                                      type="number"
                                      value={analytics.instagramFollowers || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        instagramFollowers: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-muted-foreground">TikTok Followers</label>
                                    <Input
                                      type="number"
                                      value={analytics.tiktokFollowers || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        tiktokFollowers: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-muted-foreground">Facebook Followers</label>
                                    <Input
                                      type="number"
                                      value={analytics.facebookFollowers || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        facebookFollowers: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-muted-foreground">SoundCloud Followers</label>
                                    <Input
                                      type="number"
                                      value={analytics.soundcloudFollowers || ""}
                                      onChange={(e) => setAnalytics(prev => ({
                                        ...prev!,
                                        soundcloudFollowers: parseInt(e.target.value) || undefined
                                      }))}
                                    />
                                  </div>
                                </div>
                              </div>

                              {analytics.topSpotifyTrack && (
                                <div className="space-y-2">
                                  <h4 className="font-medium">Top Spotify Track</h4>
                                  <div className="flex items-center gap-4">
                                    {analytics.topSpotifyTrack.album?.images?.[0]?.url && (
                                      <div className="relative h-12 w-12 overflow-hidden rounded">
                                        <Image
                                          src={analytics.topSpotifyTrack.album.images[0].url}
                                          alt={analytics.topSpotifyTrack.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 text-sm text-muted-foreground">
                                      <p>{analytics.topSpotifyTrack.name}</p>
                                      <p>Popularity: {analytics.topSpotifyTrack.popularity}%</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {analytics.topYoutubeVideo && (
                                <div className="space-y-2">
                                  <h4 className="font-medium">Top YouTube Video</h4>
                                  <div className="flex items-center gap-4">
                                    {analytics.topYoutubeVideo.thumbnail && (
                                      <div className="relative h-12 w-20 overflow-hidden rounded">
                                        <Image
                                          src={analytics.topYoutubeVideo.thumbnail}
                                          alt={analytics.topYoutubeVideo.title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 text-sm text-muted-foreground">
                                      <p>{analytics.topYoutubeVideo.title}</p>
                                      <p>Views: {Number(analytics.topYoutubeVideo.statistics?.viewCount).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                      {/* Similar Artists  */} 
                  <div className="space-y-6">
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Similar Artists</CardTitle>
                        <CardDescription>Artists with similar style or genre</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          <div className="space-y-4">
                            {artistData?.similarArtists?.map((artist, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <Input
                                  placeholder="Artist name"
                                  value={artist.name}
                                  onChange={(e) => {
                                    const newArtists = [...(artistData.similarArtists || [])];
                                    newArtists[index] = { ...artist, name: e.target.value };
                                    form.setValue('similarArtists', newArtists);
                                  }}
                                />
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-24"
                                  placeholder="Match %"
                                  value={artist.match}
                                  onChange={(e) => {
                                    const newArtists = [...(artistData.similarArtists || [])];
                                    newArtists[index] = { ...artist, match: e.target.value };
                                    form.setValue('similarArtists', newArtists);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Top Tracks  */} 
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Top Tracks</CardTitle>
                        <CardDescription>Most popular tracks on Spotify</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          <div className="space-y-4">
                            {artistData?.topTracks?.map((track, index) => (
                              <div key={index} className="flex items-center gap-4">
                                {track.albumImageUrl && (
                                  <div className="relative h-12 w-12 overflow-hidden rounded">
                                    <Image
                                      src={track.albumImageUrl}
                                      alt={track.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <Input
                                  placeholder="Track name"
                                  value={track.name}
                                  className="flex-1"
                                  onChange={(e) => {
                                    const newTracks = [...(artistData.topTracks || [])];
                                    newTracks[index] = { ...track, name: e.target.value };
                                    form.setValue('topTracks', newTracks);
                                  }}
                                />
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-24"
                                  placeholder="Popularity"
                                  value={track.popularity}
                                  onChange={(e) => {
                                    const newTracks = [...(artistData.topTracks || [])];
                                    newTracks[index] = { ...track, popularity: parseInt(e.target.value) };
                                    form.setValue('topTracks', newTracks);
                                  }}
                                />
                                <Input
                                  type="number"
                                  className="w-32"
                                  placeholder="spotify streams"
                                  value={track.spotify_streams}
                                  onChange={(e) => {
                                    const newTracks = [...(artistData.topTracks || [])];
                                    newTracks[index] = { ...track, spotify_streams: parseInt(e.target.value) };
                                    form.setValue('topTracks', newTracks);
                                  }}
                                />
                                {track.previewUrl && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => window.open(track.previewUrl, '_blank')}
                                  >
                                    <Music className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Top Videos</CardTitle>
                        <CardDescription>Most viewed YouTube videos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          <div className="space-y-4">
                            {artistData?.artistVideos?.map((video, index) => (
                              <div key={index} className="flex items-center gap-4">
                                {video.thumbnail && (
                                  <div className="relative h-12 w-20 overflow-hidden rounded">
                                    <Image
                                      src={video.thumbnail}
                                      alt={video.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <Input
                                  placeholder="Video title"
                                  value={video.title}
                                  className="flex-1"
                                  onChange={(e) => {
                                    const newVideos = [...(artistData.artistVideos || [])];
                                    newVideos[index] = { ...video, title: e.target.value };
                                    form.setValue('artistVideos', newVideos);
                                  }}
                                />
                                <Input
                                  type="number"
                                  className="w-32"
                                  placeholder="View count"
                                  value={video.viewCount}
                                  onChange={(e) => {
                                    const newVideos = [...(artistData.artistVideos || [])];
                                    newVideos[index] = { ...video, viewCount: parseInt(e.target.value) };
                                    form.setValue('artistVideos', newVideos);
                                  }}
                                />
                                {video.url && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => window.open(video.url, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Artist
                    </Button>

                    {showFullForm && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={loading}
                          onClick={() => form.handleSubmit(onUpdate)()}
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {!loading && <RefreshCw className="mr-2 h-4 w-4" />}
                          Update Artist
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          disabled={loading}
                          onClick={() => onYoutubeChannelUpdate(form.getValues("youtubeChannelId") || "")}
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {!loading && <RefreshCw className="mr-2 h-4 w-4" />}
                          Update YouTube Data
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
