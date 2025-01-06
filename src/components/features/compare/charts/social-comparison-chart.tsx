'use client';

import { ChartCard } from './chart-card';

interface SocialPlatform {
  name: string;
  leftValue: number;
  rightValue: number;
  color: string;
  icon: string;
  label: string;
}

interface SocialComparisonProps {
  platforms: SocialPlatform[];
  leftArtist: string;
  rightArtist: string;
}

export function SocialComparison({ platforms, leftArtist, rightArtist }: SocialComparisonProps) {
  const maxValue = Math.max(...platforms.flatMap(p => [p.leftValue, p.rightValue]));

  return (
    <ChartCard>
      <div className="w-full space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span>{leftArtist}</span>
          <span>{rightArtist}</span>
        </div>
        <div className="space-y-3">
          {platforms.map((platform) => (
            <div key={platform.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{(platform.leftValue / 1e6).toFixed(1)}M</span>
                <div className="flex items-center gap-2">
                  <img 
                    src={`/icons/${platform.icon}.svg`} 
                    alt={platform.name} 
                    className="w-4 h-4"
                  />
                  <span>{platform.label}</span>
                </div>
                <span>{platform.rightValue ? (platform.rightValue / 1e6).toFixed(1) + 'M' : '-'}</span>
              </div>
              <div className="flex h-2 gap-1">
                {/* Left bar */}
                <div className="w-1/2 flex justify-end">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(platform.leftValue / maxValue) * 100}%`,
                      backgroundColor: platform.color
                    }}
                  />
                </div>
                {/* Right bar */}
                <div className="w-1/2">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(platform.rightValue / maxValue) * 100}%`,
                      backgroundColor: platform.color,
                      opacity: 0.5
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
} 