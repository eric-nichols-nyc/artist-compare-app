'use client';

import { FanbaseChart } from './fanbase-chart';
import { PopularityChart } from '../charts/popularity-chart';
import { MonthlyListenersChart } from '../charts/monthly-listeners-chart';
import { YouTubeDailyViewsChart } from '../charts/youtube-daily-views-chart';
import { MostViewedVideos } from '../youtube/most-viewed-videos';

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

export function ComparisonSection() {
  return (
    <div className="space-y-6 p-6">
      <MostViewedVideos videos={sampleVideos} />
      <MonthlyListenersChart data={monthlyListenersData} />
      <YouTubeDailyViewsChart data={youtubeDailyViewsData} />
      <FanbaseChart data={fanbaseData} />
      <PopularityChart data={popularityData} />
    </div>
  );
} 