"use client";

import { useEffect, useState } from "react";
import { SpotifyArtist } from "@/types";
import { useArtistFormStore } from "@/stores/artist-form-store";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HeaderSkeleton } from "./skeletons";
import { getArtistInfo, revalidateArtistCache } from '@/actions';

interface ArtistDetailsProps {
  artist: SpotifyArtist;
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  const { artistInfo, dispatch } = useArtistFormStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ArtistDetails component mounted", artist.name);
    const fetchArtistInfo = async () => {
      try {
        await revalidateArtistCache(artist.name);
        const result = await getArtistInfo(artist.name);
        if (result.success) {
            // Handle successful response
            console.log(result.data);
            const {data} = result;
     
        dispatch({
          type: 'UPDATE_ARTIST_INFO',
          payload: {
            musicbrainzId: data?.musicbrainzId,
            bio: data?.biography,
            country: data?.country,
            gender: data?.gender,
            birthDate: data?.born ? new Date(data.born) : null,
            youtubeChannelId: data?.youtubeChannelId,
          }
        });

        dispatch({
          type: 'UPDATE_ANALYTICS',
          payload: {
            lastfmPlayCount: data?.lastfmPlayCount,
            lastfmListeners: data?.lastfmListeners,
            youtubeSubscribers: data?.youtubeChannelStats?.subscriberCount ?? '0',
            youtubeTotalViews: data?.youtubeChannelStats?.viewCount ?? '0',
          }
        });
      }
        else {
          // Handle error
          console.error(result.error);
      }
      } catch (error) {
        setError("Error fetching artist info");
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => {
      fetchArtistInfo();
    }, 3000);

  }, [artist.name, dispatch]);

  // console.log(state.artistInfo)
  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!artistInfo.bio) {
    return <div className="p-4">No artist bio is available</div>;
  }

  return (
    <div className="mt-4">
      {artistInfo.bio && (
        <div className="space-y-2">
          <Label htmlFor="bio">Artist Biography</Label>
          <Textarea
            id="bio"
            value={artistInfo.bio}
            readOnly
            className="min-h-[200px] bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}
