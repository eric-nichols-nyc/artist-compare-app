import { Header } from './header'
import { Sidebar } from './sidebar'
import { ArtistComparison } from './artist-comparison-component'

export function ArtistComparisonFlow() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <ArtistComparison />
      </div>
    </div>
  )
}