"use client"
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useArtistForm } from '@/providers/artist-form-provider';
interface SpotifyArtist {
spotifyId: string;
  name: string;
  imageUrl?: string;
  genres: string[];
  popularity: number;
  followers: number;
}

interface ArtistListCardProps {
  onArtistSelect?: (artist: SpotifyArtist) => void;
}

export function ArtistSearch({ onArtistSelect }: ArtistListCardProps) {
  const { state, dispatch } = useArtistForm()
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyArtist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchSpotify = debounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        console.log("data", data);
        setSearchResults(data.artists);
        dispatch({ type: 'UPDATE_ARTIST_INFO', payload: data.artists[0] });
        //
      } else {
        console.error('Search failed:', data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  useEffect(() => {
    searchSpotify(searchQuery);
  }, [searchQuery]);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Search for an Artist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Input
            placeholder="Search Spotify artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((artist) => (
              <div
                key={artist.spotifyId}
                onClick={() => {onArtistSelect?.(artist); setSearchQuery(''); setSearchResults([]);}}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                {artist.imageUrl && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={artist.imageUrl}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium">{artist.name}</div>
                  <div className="text-sm text-gray-500">
                    {artist.genres.slice(0, 2).join(', ')}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {artist.followers.toLocaleString()} followers
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center text-gray-500 py-4">
            No artists found
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}