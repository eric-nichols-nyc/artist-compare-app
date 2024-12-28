import { useEffect } from 'react'
import { useScrapedDataStore } from '@/stores/scraped-data-store'

export function StoreDebug() {
  useEffect(() => {
    const unsubscribe = useScrapedDataStore.subscribe(
      (state) => state,
      (state) => {
        console.log('Store updated:', state)
      }
    )
    return unsubscribe
  }, [])

  return null
} 