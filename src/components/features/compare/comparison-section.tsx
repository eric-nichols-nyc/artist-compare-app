'use client';

import { FanbaseChart } from './fanbase-chart';
import { PopularityChart } from '../charts/popularity-chart';
import { MonthlyListenersChart } from '../charts/monthly-listeners-chart';
import { YouTubeDailyViewsChart } from '../charts/youtube-daily-views-chart';
import { MostViewedVideos } from '../youtube/most-viewed-videos';
import { MostPlayedTracks } from '../spotify/most-played-tracks';
import { TopConnections } from '../connections/top-connections';

const fanbaseData = [
  {
    name: "Taylor Swift",
    platforms: {
      spotify: 111200000,
      youtube: 56400000,
      instagram: 280500000,
      facebook: 69800000,
      tiktok: 23400000,
      twitter: 92700000,
      deezer: 14300000,
      soundcloud: 3200000,
      twitch: 450000,
      amazon: 8900000,
      applemusic: 38500000,
      pandora: 12400000,
      vk: 890000,
      yandex: 2100000,
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
      twitter: 3900000,
      deezer: 2800000,
      soundcloud: 890000,
      twitch: 120000,
      amazon: 1900000,
      applemusic: 8900000,
      pandora: 3200000,
      vk: 180000,
      yandex: 450000,
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

export function ComparisonSection() {
  return (
    <div className="space-y-6 p-6">
    <div className="flex w-full">
        <TopConnections connections={sampleConnections} />
        <TopConnections connections={sampleConnections} />
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