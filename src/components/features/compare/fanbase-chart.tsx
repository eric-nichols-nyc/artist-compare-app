'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArtistFanbaseData } from '@/types/artist';

const PLATFORMS = {
  spotify: { name: 'Spotify', color: '#1DB954' },
  youtube: { name: 'YouTube', color: '#FF0000' },
  instagram: { name: 'Instagram', color: '#E4405F' },
  facebook: { name: 'Facebook', color: '#1877F2' },
  tiktok: { name: 'TikTok', color: '#000000' },
  twitter: { name: 'Twitter', color: '#1DA1F2' },
  deezer: { name: 'Deezer', color: '#FEAA2D' },
  soundcloud: { name: 'SoundCloud', color: '#FF3300' },
  twitch: { name: 'Twitch', color: '#9146FF' },
  amazon: { name: 'Amazon Music', color: '#00A8E1' },
  applemusic: { name: 'Apple Music', color: '#FA57C1' },
  pandora: { name: 'Pandora', color: '#3668FF' },
  vk: { name: 'VK', color: '#4C75A3' },
  yandex: { name: 'Yandex Music', color: '#FFCC00' }
};

interface FanbaseChartProps {
  data: ArtistFanbaseData[];
}

export function FanbaseChart({ data }: FanbaseChartProps) {
  const formattedData = data.map(artist => ({
    name: artist.name,
    ...artist.platforms
  }));

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Fan base</h2>
      <p className="text-sm text-gray-500 mb-6">
        Total fans, followers and subscribers
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip 
            formatter={(value: number) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Legend />
          {Object.entries(PLATFORMS).map(([key, platform]) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={platform.color}
              name={platform.name}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
