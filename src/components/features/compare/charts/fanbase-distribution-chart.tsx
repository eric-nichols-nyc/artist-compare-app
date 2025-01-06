'use client';

import { ChartCard } from './chart-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FanbaseDistributionData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

interface FanbaseDistributionProps {
  data: FanbaseDistributionData[];
  totalFans: number;
  artistName: string;
}

export function FanbaseDistribution({ data, totalFans, artistName }: FanbaseDistributionProps) {
  return (
    <ChartCard>
      <div className="w-full h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Fanbase Distribution</h2>
            <p className="text-sm text-gray-500">Social media following by platform</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${(value / 1e6).toFixed(1)}M followers`}
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: 'white' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{(totalFans / 1e6).toFixed(1)}M</span>
            <span className="text-gray-500">Total Fanbase Size</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </ChartCard>
  );
} 