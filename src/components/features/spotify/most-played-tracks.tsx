'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface TrackData {
  title: string;
  thumbnailUrl: string;
  plays: number;
  artistName: string;
}

interface MostPlayedTracksProps {
  tracks: TrackData[];
}

export function MostPlayedTracks({ tracks }: MostPlayedTracksProps) {
  const maxPlays = Math.max(...tracks.map(t => t.plays));

  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.694.495-1.055.241-2.886-1.766-6.517-2.166-10.79-1.187-.411.097-.824-.188-.92-.599-.097-.41.188-.824.599-.92 4.692-1.073 8.807-.620 12.045 1.371.362.227.486.694.241 1.055zm1.474-3.267c-.302.464-.863.615-1.327.313-3.301-2.028-8.325-2.614-12.226-1.429-.513.152-1.053-.143-1.205-.656-.151-.513.143-1.053.656-1.205 4.458-1.352 9.994-.686 13.755 1.648.464.302.615.863.313 1.327zm.127-3.403C15.17 8.454 8.804 8.229 5.132 9.36c-.614.19-1.265-.15-1.455-.765-.19-.614.15-1.265.765-1.455 4.277-1.297 11.385-1.047 15.86 1.62.554.329.736 1.045.407 1.599-.33.554-1.045.736-1.599.407z"/>
        </svg>
        Most Played Spotify Track Alltime
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {tracks.map((track, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={track.thumbnailUrl}
                alt={track.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.694.495-1.055.241-2.886-1.766-6.517-2.166-10.79-1.187-.411.097-.824-.188-.92-.599-.097-.41.188-.824.599-.92 4.692-1.073 8.807-.620 12.045 1.371.362.227.486.694.241 1.055zm1.474-3.267c-.302.464-.863.615-1.327.313-3.301-2.028-8.325-2.614-12.226-1.429-.513.152-1.053-.143-1.205-.656-.151-.513.143-1.053.656-1.205 4.458-1.352 9.994-.686 13.755 1.648.464.302.615.863.313 1.327zm.127-3.403C15.17 8.454 8.804 8.229 5.132 9.36c-.614.19-1.265-.15-1.455-.765-.19-.614.15-1.265.765-1.455 4.277-1.297 11.385-1.047 15.86 1.62.554.329.736 1.045.407 1.599-.33.554-1.045.736-1.599.407z"/>
                </svg>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">{track.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{(track.plays / 1e9).toFixed(1)}B</span>
                  <span className="text-gray-500">Plays</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ 
                      width: `${(track.plays / maxPlays) * 100}%`,
                      backgroundColor: index === 0 ? '#1DB954' : '#90EEB1'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 