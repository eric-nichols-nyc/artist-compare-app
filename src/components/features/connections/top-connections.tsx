'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ArtistConnection {
  name: string;
  imageUrl: string;
  country: string;
  genre: string;
}

interface TopConnectionsProps {
  connections: ArtistConnection[];
}

export function TopConnections({ connections }: TopConnectionsProps) {
  return (
    <div className="flex-1 mb-8">
      <h2 className="text-xl font-semibold mb-4">Top Connections</h2>
      <div className="space-y-3">
        {connections.map((artist, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{artist.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Image
                      src={`https://flagcdn.com/${artist.country.toLowerCase()}.svg`}
                      alt={artist.country}
                      width={20}
                      height={15}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-500">{artist.country}</span>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {artist.genre}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 