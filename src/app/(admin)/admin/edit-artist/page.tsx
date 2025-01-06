import { ContentLayout } from '@/app/(admin)/admin/_components/content-layout'
import { PreviewArtistContent } from '../_components/artist/preview-artist-content'

export default async function PreviewArtistPage() {
  return (
    <ContentLayout title="Preview Artist">
      <PreviewArtistContent />
    </ContentLayout>
  )
}
