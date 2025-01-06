'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { formatNumber } from "@/lib/utils";

interface VideoData {
  title: string;
  thumbnailUrl: string;
  views: number;
  artistName: string;
}

export function MostViewedVideos() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  const artist1 = searchParams.get('artist1');
  const artist2 = searchParams.get('artist2');

  useEffect(() => {
    const fetchMostViewedVideos = async () => {
      if (!artist1 || !artist2) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/compare/youtube?artist1=${encodeURIComponent(artist1)}&artist2=${encodeURIComponent(artist2)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch videos');
        }
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch videos');
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMostViewedVideos();
  }, [artist1, artist2]);

  if (!artist1 || !artist2) return null;

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (videos.length === 0) {
    return null;
  }

  const maxViews = Math.max(...videos.map(v => v.views));

  return (
    <Card className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        <h2 className="text-xl font-semibold">Most Viewed Music Videos</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <Card key={index} className="overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center group">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Title and Artist */}
              <div>
                <h3 className="font-medium text-lg line-clamp-2 mb-1" title={video.title}>
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {video.artistName}
                </p>
              </div>

              {/* Views Counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatNumber(video.views)} views</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {((video.views / maxViews) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(video.views / maxViews) * 100}%`,
                      backgroundColor: index === 0 ? '#FF0000' : '#FF6B6B'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
} 