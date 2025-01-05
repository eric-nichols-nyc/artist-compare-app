"use server"

import { ArtistIngestionService } from '@/services/artist-ingestion-service';
import { unstable_cache, revalidateTag } from 'next/cache';

const artistIngestionService = new ArtistIngestionService();

export const getArtistInfo = unstable_cache(
    async (name: string) => {
        try {
            const artistInfo = await artistIngestionService.getArtistInfo(name);
            console.log('artistInfo from action is ',artistInfo)
            return { success: true, data: artistInfo };
        } catch (error) {
            console.error('Error fetching artist info:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch artist info' 
            };
        }
    },
    [`artist-info`], // Static cache key
    {
        revalidate: 60 * 60 * 24,
        tags: [`artist`] // Static tag
    }
);

// Optional: Add a revalidation action if you need to clear cache
export async function revalidateArtistCache(artistName: string) {
    "use server"
    revalidateTag(`artist-${artistName}`);
}