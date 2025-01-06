'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ChartCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ children, className = '' }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
} 