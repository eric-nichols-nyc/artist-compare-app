import { useScrapedDataStore } from '@/stores/scraped-data-store'
import { useArtistFormStore } from '@/stores/artist-form-store'
import { useState } from 'react'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function StoreInspector() {
  const [selectedStore, setSelectedStore] = useState<'scraped' | 'form'>('scraped')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const scrapedStore = useScrapedDataStore()
  const formStore = useArtistFormStore()

  const stores = {
    scraped: {
      name: 'Scraped Data Store',
      data: scrapedStore
    },
    form: {
      name: 'Artist Form Store',
      data: formStore
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/80 text-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-gray-800">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className={selectedStore === 'scraped' ? 'bg-gray-700' : ''}
              onClick={() => setSelectedStore('scraped')}
            >
              Scraped
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={selectedStore === 'form' ? 'bg-gray-700' : ''}
              onClick={() => setSelectedStore('form')}
            >
              Form
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="p-4 max-w-lg max-h-[600px] overflow-auto">
            <div className="font-mono">
              <div className="font-semibold mb-2">{stores[selectedStore].name}</div>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(stores[selectedStore].data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 