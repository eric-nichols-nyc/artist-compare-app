"use client";

import { useEffect, useState } from "react";
import { useArtistFormStore } from "@/stores/artist-form-store";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HeaderSkeleton } from "./skeletons";
import { getArtistInfo, revalidateArtistCache } from '@/actions';

interface ArtistDetailsProps {
  artistName: string;
}

export function ArtistDetails({ artistName }: ArtistDetailsProps) {
  const { artistInfo, dispatch } = useArtistFormStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ArtistDetails component mounted", artistName);
    const fetchArtistInfo = async () => {
      try {
        await revalidateArtistCache(artistName);
        const result = await getArtistInfo(artistName);
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
            youtubeSubscribers: data?.youtubeChannelStats?.subscriberCount 
              ? Number(data.youtubeChannelStats.subscriberCount) 
              : null,
            youtubeTotalViews: data?.youtubeChannelStats?.viewCount 
              ? Number(data.youtubeChannelStats.viewCount) 
              : null,
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

  }, [artistName, dispatch]);

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
