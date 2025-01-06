'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface VideoData {
  title: string;
  thumbnailUrl: string;
  views: number;
  artistName: string;
}

interface MostViewedVideosProps {
  videos: VideoData[];
}

export function MostViewedVideos({ videos }: MostViewedVideosProps) {
  const maxViews = Math.max(...videos.map(v => v.views));

  return (
    <div className="mb-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        Most Viewed YouTube Video Alltime
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">{video.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{(video.views / 1e9).toFixed(1)}B</span>
                  <span className="text-gray-500">Plays</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-red-500 rounded-full"
                    style={{ 
                      width: `${(video.views / maxViews) * 100}%`,
                      backgroundColor: index === 0 ? '#FF0000' : '#FF9999'
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