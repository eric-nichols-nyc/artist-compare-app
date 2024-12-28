import { useScrapedDataStore } from '@/stores/scraped-data-store'

export function StoreInspector() {
  const store = useScrapedDataStore()

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-lg max-h-96 overflow-auto">
      <pre className="text-xs">
        {JSON.stringify(store, null, 2)}
      </pre>
    </div>
  )
} 