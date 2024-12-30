import { ArtistComparisonFlow } from '@/components/artist-comparison-flow'
import { Suspense } from 'react'

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ArtistComparisonFlow />
      </Suspense>
    </main>
  )
}