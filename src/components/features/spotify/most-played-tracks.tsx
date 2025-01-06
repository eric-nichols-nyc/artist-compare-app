'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { formatNumber } from "@/lib/utils";

interface TrackData {
  title: string;
  thumbnailUrl: string;
  plays: number;
  artistName: string;
}

function PlayComparisonBar({ tracks }: { tracks: TrackData[] }) {
  if (tracks.length !== 2) return null;

  const maxPlays = Math.max(tracks[0].plays, tracks[1].plays);
  const leftWidth = (tracks[0].plays / maxPlays) * 100;
  const rightWidth = (tracks[1].plays / maxPlays) * 100;

  return (
    <div className="relative h-16 flex items-center">
      {/* Play count left */}
      <div className="absolute left-0 -top-8 font-medium text-black dark:text-white">
        {formatNumber(tracks[0].plays)}
      </div>

      {/* Left Bar */}
      <div className="flex-1 h-12 flex justify-end">
        <div 
          className="bg-[#1DB954] h-full rounded-l-md transition-all duration-500"
          style={{ width: `${leftWidth}%` }}
        />
      </div>

      {/* Center Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.694.495-1.055.241-2.886-1.766-6.517-2.166-10.79-1.187-.411.097-.824-.188-.92-.599-.097-.41.188-.824.599-.92 4.692-1.073 8.807-.620 12.045 1.371.362.227.486.694.241 1.055zm1.474-3.267c-.302.464-.863.615-1.327.313-3.301-2.028-8.325-2.614-12.226-1.429-.513.152-1.053-.143-1.205-.656-.151-.513.143-1.053.656-1.205 4.458-1.352 9.994-.686 13.755 1.648.464.302.615.863.313 1.327zm.127-3.403C15.17 8.454 8.804 8.229 5.132 9.36c-.614.19-1.265-.15-1.455-.765-.19-.614.15-1.265.765-1.455 4.277-1.297 11.385-1.047 15.86 1.62.554.329.736 1.045.407 1.599-.33.554-1.045.736-1.599.407z"/>
          </svg>
        </div>
      </div>

      {/* Right Bar */}
      <div className="flex-1 h-12 flex justify-start">
        <div 
          className="bg-[#90EEB1] h-full rounded-r-md transition-all duration-500"
          style={{ width: `${rightWidth}%` }}
        />
      </div>

      {/* Play count right */}
      <div className="absolute right-0 -top-8 font-medium text-black dark:text-white">
        {formatNumber(tracks[1].plays)}
      </div>
    </div>
  );
}

export function MostPlayedTracks() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  const artist1 = searchParams.get('artist1');
  const artist2 = searchParams.get('artist2');

  useEffect(() => {
    const fetchMostPlayedTracks = async () => {
      if (!artist1 || !artist2) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/compare/spotify?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tracks');
        }
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setTracks(data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch tracks');
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMostPlayedTracks();
  }, [artist1, artist2]);

  if (!artist1 || !artist2) return null;

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (tracks.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.694.495-1.055.241-2.886-1.766-6.517-2.166-10.79-1.187-.411.097-.824-.188-.92-.599-.097-.41.188-.824.599-.92 4.692-1.073 8.807-.620 12.045 1.371.362.227.486.694.241 1.055zm1.474-3.267c-.302.464-.863.615-1.327.313-3.301-2.028-8.325-2.614-12.226-1.429-.513.152-1.053-.143-1.205-.656-.151-.513.143-1.053.656-1.205 4.458-1.352 9.994-.686 13.755 1.648.464.302.615.863.313 1.327zm.127-3.403C15.17 8.454 8.804 8.229 5.132 9.36c-.614.19-1.265-.15-1.455-.765-.19-.614.15-1.265.765-1.455 4.277-1.297 11.385-1.047 15.86 1.62.554.329.736 1.045.407 1.599-.33.554-1.045.736-1.599.407z"/>
        </svg>
        <h2 className="text-xl font-semibold">Most Played Tracks</h2>
      </div>
      
      <div className="space-y-6">
        {tracks.map((track, index) => (
          <div key={index} className="flex gap-4 items-center">
            <div className="relative w-48 aspect-video flex-shrink-0">
              <Image
                src={track.thumbnailUrl}
                alt={track.title}
                fill
                className="object-cover rounded-md"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/20 rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/90 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-base line-clamp-1 mb-1" title={track.title}>
                {track.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {track.artistName}
              </p>
            </div>
            
            <div className="flex-shrink-0 text-sm font-medium">
              {formatNumber(track.plays)} plays
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PlayComparisonBar tracks={tracks} />
      </div>
    </Card>
  );
} 