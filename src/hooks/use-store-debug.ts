import { useEffect } from 'react'
import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { useArtistFormStore } from '@/stores/artist-form-store'

export function useStoreDebug() {
  useEffect(() => {
    const unsubScraped = useScrapedDataStore.subscribe(
      (state) => state,
      (state) => {
        console.log('🔄 Scraped Store Updated:', state)
      }
    )

    const unsubForm = useArtistFormStore.subscribe(
      (state) => state,
      (state) => {
        console.log('📝 Form Store Updated:', state)
      }
    )

    return () => {
      unsubScraped()
      unsubForm()
    }
  }, [])
} 