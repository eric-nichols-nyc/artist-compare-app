'use client';

import { ChartCard } from './chart-card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface MonthlyListenersData {
  date: string;
  artists: {
    name: string;
    listeners: number;
    color: string;
  }[];
}

interface MonthlyListenersChartProps {
  data: MonthlyListenersData[];
}

export function MonthlyListenersChart({ data }: MonthlyListenersChartProps) {
  return (
    <ChartCard>
      <div className="w-full h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.694.495-1.055.241-2.886-1.766-6.517-2.166-10.79-1.187-.411.097-.824-.188-.92-.599-.097-.41.188-.824.599-.92 4.692-1.073 8.807-.620 12.045 1.371.362.227.486.694.241 1.055zm1.474-3.267c-.302.464-.863.615-1.327.313-3.301-2.028-8.325-2.614-12.226-1.429-.513.152-1.053-.143-1.205-.656-.151-.513.143-1.053.656-1.205 4.458-1.352 9.994-.686 13.755 1.648.464.302.615.863.313 1.327zm.127-3.403C15.17 8.454 8.804 8.229 5.132 9.36c-.614.19-1.265-.15-1.455-.765-.19-.614.15-1.265.765-1.455 4.277-1.297 11.385-1.047 15.86 1.62.554.329.736 1.045.407 1.599-.33.554-1.045.736-1.599.407z"/>
              </svg>
              Spotify monthly listeners
            </h2>
            <p className="text-sm text-gray-500">Daily evolution of Spotify monthly listeners (rolling 30 days)</p>
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
              formatter={(value: number) => [`${(value).toLocaleString()}`, 'Monthly Listeners']}
            />
            <Legend />
            {data[0]?.artists.map((artist) => (
              <Line
                key={artist.name}
                type="monotone"
                dataKey={(item) => 
                  item.artists.find(a => a.name === artist.name)?.listeners
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