
import { ContentLayout } from '@/app/(admin)/admin/_components/content-layout'
import { ArtistMetricsTable } from './_components/artist-table'

export default function DashboardPage() {
  return <ContentLayout title="Dashboard">
    <ArtistMetricsTable />
  </ContentLayout>
}