'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PopularityData {
  date: string;
  artists: {
    name: string;
    popularity: number;
    color: string;
  }[];
}

interface PopularityChartProps {
  data: PopularityData[];
}

export function PopularityChart({ data }: PopularityChartProps) {
  return (
    <div className="w-full h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Spotify popularity</h2>
          <p className="text-sm text-gray-500">Spotify popularity over time</p>
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
            domain={[90, 102]} 
            ticks={[90, 92, 94, 96, 98, 100, 102]}
            stroke="#9CA3AF"
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
          />
          <Legend />
          {data[0]?.artists.map((artist) => (
            <Line
              key={artist.name}
              type="monotone"
              dataKey={(item) => 
                item.artists.find(a => a.name === artist.name)?.popularity
              }
              name={artist.name}
              stroke={artist.color}
              dot={{ fill: artist.color }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 