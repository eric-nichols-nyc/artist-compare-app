"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"

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

export default function NewArtistForm() {
  const [loading, setLoading] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: "",
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
    },
  })

  async function onSearchArtist(data: { name: string }) {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/add-artist?name=${encodeURIComponent(data.name)}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch artist details")
      }

      const artistData = await response.json()
      
      // Update form with fetched data
      form.reset({
        name: data.name,
        spotifyId: artistData.spotifyId || null,
        lastFmId: artistData.lastFmId || null,
        youtubeChannelId: artistData.youtubeChannelId || null,
        bio: artistData.bio || null,
        genres: artistData.genres || [],
        imageUrl: artistData.imageUrl || null,
        youtubeUrl: artistData.youtubeUrl || null,
        spotifyUrl: artistData.spotifyUrl || null,
        tiktokUrl: artistData.tiktokUrl || null,
        instagramUrl: artistData.instagramUrl || null,
      })

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

      const response = await fetch("/api/artists", {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Artist</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(showFullForm ? onSubmit : onSearchArtist)} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Artist
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
