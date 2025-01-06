'use client';

import { ChartCard } from './chart-card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArtistFanbaseData } from '@/types/artist';

const PLATFORMS = {
  spotify: { name: 'Spotify', color: '#1DB954' },
  youtube: { name: 'YouTube', color: '#FF0000' },
  instagram: { name: 'Instagram', color: '#E4405F' },
  facebook: { name: 'Facebook', color: '#1877F2' },
  tiktok: { name: 'TikTok', color: '#000000' },
  soundcloud: { name: 'SoundCloud', color: '#FF3300' },
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
    <ChartCard>
      <div className="w-full h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Fan base</h2>
            <p className="text-sm text-gray-500">Total fans, followers and subscribers</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip 
              formatter={(value: number) => `${(value / 1000000).toFixed(1)}M`}
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
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
    </ChartCard>
  );
}
