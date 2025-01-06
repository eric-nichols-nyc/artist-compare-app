import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface BaseAnalyticsProps {
  title: string;
  bgColor: string;
  children: ReactNode;
}

export function BaseAnalytics({ title, bgColor, children }: BaseAnalyticsProps) {
  return (
    <Card className={`p-4 ${bgColor}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-medium text-sm">{title}</h5>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    </Card>
  );
} 