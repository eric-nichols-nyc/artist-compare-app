import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => {
  return <Skeleton className="h-48 w-full" />;
};


export const TracksSkeleton = () => {
  return <div className="flex flex-col gap-4">
    <Skeleton className="h-[80px] w-full" />
    <Skeleton className="h-[80px] w-full" />
    <Skeleton className="h-[80px] w-full" />
    <Skeleton className="h-[80px] w-full" />
    <Skeleton className="h-[80px] w-full" />
  </div>
};

export const VideosSkeleton = () => {
  return <div className="p-4">
    <Skeleton className="h-[600px] w-full" />
  </div>
};