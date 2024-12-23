"use client";

import { useEffect, useState, Suspense } from "react";
import { ArtistIngestionResponse, SpotifyArtist } from "@/types/api";

interface ArtistDetailsProps {
  artist: SpotifyArtist;
}

export function ArtistDetails({ artist }: ArtistDetailsProps) {
  const [artistInfo, setArtistInfo] = useState<ArtistIngestionResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/api/admin/ingest-artist?name=" + artist.name
        );
        const data = await response.json();
        setArtistInfo(data);
      } catch (error) {
        console.error("Error fetching artist info:", error);
        setError("Failed to load artist details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistInfo();
  }, [artist.name]);

  if (isLoading) {
    return <div className="p-4">Loading artist details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!artistInfo) {
    return <div className="p-4">No artist information available</div>;
  }

  return (
    <div className="mt-4">
      {artistInfo.biography && (
        <div className="prose prose-sm max-w-none">
          <p>{artistInfo.biography}</p>
        </div>
      )}
    </div>
  );
}
