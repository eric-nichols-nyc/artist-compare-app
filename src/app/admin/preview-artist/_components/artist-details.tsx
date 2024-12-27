"use client";

import { useEffect, useState } from "react";
import { SpotifyArtist } from "@/types";
import { useArtistForm } from "@/providers/artist-form-provider";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ArtistDetailsProps {
  artist: SpotifyArtist;
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
    const { state, dispatch } = useArtistForm()
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        const response = await fetch(`/api/admin/ingest-artist?name=${artist.name}`);
        const data = await response.json();
        dispatch({
          type: 'UPDATE_ARTIST_INFO',
          payload: {
            musicbrainzId: data.musicbrainzId,
            bio: data.biography,
            country: data.country,
            gender: data.gender,
            activeYears: {
              begin: data.begin,
              end: data.end,
            },
            youtubeChannelId: data.youtubeChannelId,
          }
        });

        dispatch({
          type: 'UPDATE_ANALYTICS',
          payload: {
            lastfmPlayCount: data.lastfmPlayCount,
            lastfmListeners: data.lastfmListeners,
            youtubeSubscribers: data.youtubeChannelStats.subscriberCount,
            youtubeTotalViews: data.youtubeChannelStats.viewCount,
          }
        });
      } catch (error) {
        console.error("Error fetching artist info:", error);
        setError("Error fetching artist info");
      }finally{
        setIsLoading(false);
      }
    };

    fetchArtistInfo();
  }, [artist.name, dispatch]);

  // console.log(state.artistInfo)
  if (isLoading) {
    return <div className="p-4">Loading artist details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!state.artistInfo.bio) {
    return <div className="p-4">No artist bio is available</div>;
  }

  return (
    <div className="mt-4">
      {state.artistInfo.bio && (
        <div className="space-y-2">
          <Label htmlFor="bio">Artist Biography</Label>
          <Textarea
            id="bio"
            value={state.artistInfo.bio}
            readOnly
            className="min-h-[200px] bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}
