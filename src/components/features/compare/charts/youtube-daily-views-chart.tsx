'use client';

import { ChartCard } from './chart-card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface YouTubeViewsData {
  date: string;
  artists: {
    name: string;
    views: number;
    color: string;
  }[];
}

interface YouTubeDailyViewsChartProps {
  data: YouTubeViewsData[];
}

export function YouTubeDailyViewsChart({ data }: YouTubeDailyViewsChartProps) {
  return (
    <ChartCard>
      <div className="w-full h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube daily views
            </h2>
            <p className="text-sm text-gray-500">YouTube daily views over time</p>
          </div>
          <select className="bg-transparent border rounded-md px-2 py-1 text-sm">
            <option>Last 28 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
              })}
              formatter={(value: number) => [`${(value).toLocaleString()}`, 'Daily Views']}
            />
            <Legend />
            {data[0]?.artists.map((artist) => (
              <Line
                key={artist.name}
                type="monotone"
                dataKey={(item) => 
                  item.artists.find(a => a.name === artist.name)?.views
                }
                name={artist.name}
                stroke={artist.color}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
} 