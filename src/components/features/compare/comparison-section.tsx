'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFanbaseStore } from '@/store/fanbase-store';
import { FanbaseChart } from './charts/fanbase-chart';
import { FanbaseDistribution } from './charts/fanbase-distribution-chart';
// import { PopularityChart } from './charts/popularity-chart';
// import { MonthlyListenersChart } from './charts/monthly-listeners-chart';
// import { YouTubeDailyViewsChart } from './charts/youtube-daily-views-chart';
import { MostViewedVideos } from '../youtube/most-viewed-videos';
import { MostPlayedTracks } from '../spotify/most-played-tracks';
// import { TopConnections } from '../connections/top-connections';
// import { SocialComparison } from './charts/social-comparison-chart';

export function ComparisonSection() {
  const searchParams = useSearchParams();
  const { fanbaseData, isLoading, error, fetchFanbaseData, clearStore } = useFanbaseStore();

  useEffect(() => {
    const artist1 = searchParams.get('artist1');
    const artist2 = searchParams.get('artist2');
    
    if (artist1 && artist2) {
      fetchFanbaseData(artist1, artist2);
    } else {
      clearStore();
    }
  }, [searchParams, fetchFanbaseData, clearStore]);

  // Sort fanbaseData to match URL order
  const sortedFanbaseData = useMemo(() => {
    const artist1 = searchParams.get('artist1');
    const artist2 = searchParams.get('artist2');
    
    if (!artist1 || !artist2 || !fanbaseData.length) return fanbaseData;

    return [...fanbaseData].sort((a, b) => {
      if (a.name === artist1) return -1;
      if (b.name === artist1) return 1;
      return 0;
    });
  }, [fanbaseData, searchParams]);

  if (!searchParams.get('artist1') || !searchParams.get('artist2')) {
    return <div>Please select two artists to compare</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
    
      {/* Pie charts for each artist */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedFanbaseData.map((artist, index) => (
          <FanbaseDistribution 
            key={artist.name}
            data={transformDataForDistribution(artist)}
            totalFans={calculateTotalFans(artist)}
            artistName={artist.name}
          />
        ))}
      </div>
           <div className="w-full">
        <FanbaseChart data={sortedFanbaseData} />
      </div> */}
      
      <MostViewedVideos />
    </div>
  );
}

// Helper functions
function calculateTotalFans(artist: ArtistFanbaseData) {
  if (!artist) return 0;
  return Object.values(artist.platforms).reduce((sum, count) => sum + count, 0);
}

function transformDataForDistribution(artist: ArtistFanbaseData) {
  if (!artist) return [];
  
  const PLATFORM_COLORS = {
    spotify: '#1DB954',
    youtube: '#FF0000',
    instagram: '#E4405F',
    facebook: '#1877F2',
    tiktok: '#000000',
    soundcloud: '#FF3300',
  };

  return Object.entries(artist.platforms).map(([platform, value]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value,
    color: PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS],
    icon: `/${platform}-icon.svg`, // Assuming you have these icons
  }));
} 