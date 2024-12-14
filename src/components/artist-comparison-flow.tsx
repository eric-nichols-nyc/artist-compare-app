"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SimilarArtist {
  artist: string;
  similarity: number;
}

interface Artist {
    name: string;
    id: string[];
}

const ArtistComparisonFlow: React.FC = () => {
  const [artist1, setArtist1] = useState("");
  const [artist2, setArtist2] = useState("");
  const [artists, setArtists] = useState<Artist[] | undefined>(undefined); // Example: ['Radiohead', 'Eagles', 'Pink Floyd'
  const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimilarArtists = async (artist: string) => {
    if (!artist) return;
        if (!artist) return;
        console.log("Fetching similar artists for " + artist);
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/artists/${encodeURIComponent(artist)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch similar artists");
      }
      const data = await response.json();
      console.log(data)
      setSimilarArtists(data.similarArtists);
      setArtist2(""); // Reset artist 2 when artist 1 changes
      setComparison(""); // Reset comparison
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch similar artists");
    }
    setLoading(false);
  };

  const fetchComparison = useCallback(async() => {
    console.log("Fetching comparison for " + artist2 + " and " + artist1);
    if (!artist1 || !artist2) {
        alert ("You must select two artists first."); 
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist1, artist2 }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate comparison");
      }

      const data = await response.json();
      setComparison(data.comparison);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate comparison");
    }
    setLoading(false);
  },[artist1, artist2]); 

  const fettchArtistList = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/artists");
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }
      const data = await response.json();
      console .log("Data:", data); // Log the fetched artist list to the console
      setArtists(data.artists);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fettchArtistList();
  }, []);

  useEffect(() => {
    if(artist2.length)
    fetchComparison();
  }, [artist2]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Artist 1 Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select First Artist</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            className="w-full p-2 border rounded"
            value={artist1}
            onChange={(e) => {
              setArtist1(e.target.value);
              fetchSimilarArtists(e.target.value);
            }}
          >
            <option value="">Select an artist...</option>
            {/* You would populate this with your artist list */}
            {artists && artists.length && artists.map((artist:Artist, index) => (
              <option key={index} value={artist.name}>
                {artist.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Similar Artists Display */}
      {similarArtists.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Similar Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <select
                className="w-full p-2 border rounded"
                value={artist2}
                onChange={(e) => {
                  setArtist2(e.target.value)
                }}
              >
                <option value="">Select second artist...</option>
                {similarArtists.map((artist, index) => (
                  <option key={index} value={artist.artist}>
                    {artist.artist} (Similarity:{" "}
                    {(artist.similarity * 100).toFixed(1)}%)
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent>
            <div className="p-4 text-center">Generating comparison...</div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Display */}
      {!loading && comparison && (
        <Card>
          <CardHeader>
            <CardTitle>Artist Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <h3 className="text-lg font-semibold mb-2">
                {artist1} vs {artist2}
              </h3>
              <p className="whitespace-pre-wrap">{comparison}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArtistComparisonFlow;
