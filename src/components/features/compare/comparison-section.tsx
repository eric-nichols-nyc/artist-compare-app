'use client';

import { FanbaseChart } from './charts/fanbase-chart';
import { PopularityChart } from './charts/popularity-chart';
import { MonthlyListenersChart } from './charts/monthly-listeners-chart';
import { YouTubeDailyViewsChart } from './charts/youtube-daily-views-chart';
import { MostViewedVideos } from '../youtube/most-viewed-videos';
import { MostPlayedTracks } from '../spotify/most-played-tracks';
import { TopConnections } from '../connections/top-connections';
import { FanbaseDistribution } from './charts/fanbase-distribution-chart';
import { SocialComparison } from './charts/social-comparison-chart';

const fanbaseData = [
  {
    name: "Taylor Swift",
    platforms: {
      spotify: 111200000,
      youtube: 56400000,
      instagram: 280500000,
      facebook: 69800000,
      tiktok: 23400000,
      soundcloud: 3200000,
    },
    totalFollowers: 727000000
  },
  {
    name: "Sabrina Carpenter",
    platforms: {
      spotify: 38900000,
      youtube: 5200000,
      instagram: 30800000,
      facebook: 2100000,
      tiktok: 18400000,
      soundcloud: 890000,
    },
    totalFollowers: 119000000
  }
];

const popularityData = [
  {
    date: '2024-12-09',
    artists: [
      { name: 'Taylor Swift', popularity: 100, color: '#FF9500' },
      { name: 'Sabrina Carpenter', popularity: 94, color: '#FF2D55' }
    ]
  },
  {
    date: '2024-12-12',
    artists: [
      { name: 'Taylor Swift', popularity: 100, color: '#FF9500' },
      { name: 'Sabrina Carpenter', popularity: 94, color: '#FF2D55' }
    ]
  },
  {
    date: '2025-01-05',
    artists: [
      { name: 'Taylor Swift', popularity: 100, color: '#FF9500' },
      { name: 'Sabrina Carpenter', popularity: 94, color: '#FF2D55' }
    ]
  }
];

const monthlyListenersData = [
  {
    date: '2024-12-09',
    artists: [
      { name: 'Taylor Swift', listeners: 92970321, color: '#FF9500' },
      { name: 'Sabrina Carpenter', listeners: 80685745, color: '#FF2D55' }
    ]
  },
  {
    date: '2024-12-12',
    artists: [
      { name: 'Taylor Swift', listeners: 93500000, color: '#FF9500' },
      { name: 'Sabrina Carpenter', listeners: 81200000, color: '#FF2D55' }
    ]
  },
  {
    date: '2024-12-15',
    artists: [
      { name: 'Taylor Swift', listeners: 94100000, color: '#FF9500' },
      { name: 'Sabrina Carpenter', listeners: 82400000, color: '#FF2D55' }
    ]
  },
  // Add more dates...
];

const youtubeDailyViewsData = [
  {
    date: '2024-12-09',
    artists: [
      { name: 'Taylor Swift', views: 13500000, color: '#FF9500' },
      { name: 'Sabrina Carpenter', views: 7800000, color: '#FF2D55' }
    ]
  },
  {
    date: '2024-12-12',
    artists: [
      { name: 'Taylor Swift', views: 14200000, color: '#FF9500' },
      { name: 'Sabrina Carpenter', views: 8100000, color: '#FF2D55' }
    ]
  },
  {
    date: '2024-12-15',
    artists: [
      { name: 'Taylor Swift', views: 12800000, color: '#FF9500' },
      { name: 'Sabrina Carpenter', views: 7500000, color: '#FF2D55' }
    ]
  },
  // Add more dates...
];

const sampleVideos = [
  {
    title: "Lady Gaga - Bad Romance (Official Music Video)",
    thumbnailUrl: "https://i.ytimg.com/vi/qrO4YZeyl0I/maxresdefault.jpg",
    views: 1900000000,
    artistName: "Lady Gaga"
  },
  {
    title: "will.i.am - Scream & Shout ft. Britney Spears (Official Music Video)",
    thumbnailUrl: "https://i.ytimg.com/vi/kYtGl1dX5qI/maxresdefault.jpg",
    views: 1100000000,
    artistName: "will.i.am"
  }
];

const sampleTracks = [
  {
    title: "Shape of You",
    thumbnailUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    plays: 3200000000,
    artistName: "Ed Sheeran"
  },
  {
    title: "Blinding Lights",
    thumbnailUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    plays: 2800000000,
    artistName: "The Weeknd"
  }
];

const sampleConnections = [
  {
    name: "Sabrina Carpenter",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebf0c30372ad69e7c788845b95",
    country: "USA",
    genre: "POP"
  },
  {
    name: "Ariana Grande",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebcdce7620dc940db079bf4952",
    country: "USA",
    genre: "POP"
  },
  {
    name: "Lady Gaga",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb0e08ea2c4d6789fbf5cbe0aa",
    country: "USA",
    genre: "POP"
  },
  {
    name: "Rihanna",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789",
    country: "BRB",
    genre: "POP"
  },
  {
    name: "Selena Gomez",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eba5205abffd84341e5bace828",
    country: "USA",
    genre: "POP"
  }
];

const fanbaseDistributionData = [
  {
    name: 'Instagram',
    value: 280500000,
    color: '#E4405F',
    icon: 'instagram'
  },
  {
    name: 'Facebook',
    value: 69800000,
    color: '#1877F2',
    icon: 'facebook'
  },
  {
    name: 'Spotify',
    value: 111200000,
    color: '#1DB954',
    icon: 'spotify'
  },
  {
    name: 'YouTube',
    value: 56400000,
    color: '#FF0000',
    icon: 'youtube'
  },
  {
    name: 'TikTok',
    value: 23400000,
    color: '#000000',
    icon: 'tiktok'
  }
];

const socialComparisonData = [
  {
    name: 'spotify',
    leftValue: 4400000,
    rightValue: 2200000,
    color: '#1DB954',
    icon: 'spotify',
    label: 'Followers'
  },
  {
    name: 'youtube',
    leftValue: 1800000,
    rightValue: 500000,
    color: '#FF0000',
    icon: 'youtube',
    label: 'Subscribers'
  },
  {
    name: 'instagram',
    leftValue: 1200000,
    rightValue: 0,
    color: '#E4405F',
    icon: 'instagram',
    label: 'Followers'
  },
  {
    name: 'facebook',
    leftValue: 227800,
    rightValue: 501700,
    color: '#1877F2',
    icon: 'facebook',
    label: 'Followers'
  },
  {
    name: 'soundcloud',
    leftValue: 454600,
    rightValue: 168800,
    color: '#FF3300',
    icon: 'soundcloud',
    label: 'Fans'
  },
  {
    name: 'tiktok',
    leftValue: 1900000,
    rightValue: 295000,
    color: '#000000',
    icon: 'tiktok',
    label: 'Followers'
  }
];

export function ComparisonSection() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex w-full">
        <TopConnections connections={sampleConnections} />
        <TopConnections connections={sampleConnections} />
      </div>
      <SocialComparison 
        platforms={socialComparisonData}
        leftArtist="Taylor Swift"
        rightArtist="Sabrina Carpenter"
      />
      <div className="grid grid-cols-2 gap-6">
        <FanbaseDistribution 
          data={fanbaseDistributionData} 
          totalFans={727000000}
          artistName="Taylor Swift"
        />
        <FanbaseDistribution 
          data={fanbaseDistributionData.map(d => ({ ...d, value: d.value * 0.4 }))} 
          totalFans={119000000}
          artistName="Sabrina Carpenter"
        />
      </div>
      <FanbaseChart data={fanbaseData} />
      <MostPlayedTracks tracks={sampleTracks} />
      <PopularityChart data={popularityData} />
      <MonthlyListenersChart data={monthlyListenersData} />
      <MostViewedVideos videos={sampleVideos} />
      <YouTubeDailyViewsChart data={youtubeDailyViewsData} />
    </div>
  );
} 