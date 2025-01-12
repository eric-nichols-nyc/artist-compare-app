import ArtistComparisonSection from '@/components/artist-comparison-section';
import TopBanner from '@/components/top-banner';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900">
      <TopBanner />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <ArtistComparisonSection />
      </div>
    </div>
  );
}
