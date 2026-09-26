import { SiteHeader } from '@/components/site-header'
import { TierList } from '@/components/tier-list'

export default function TierPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-7xl px-4 pt-1 md:px-6 lg:px-8">
          <TierList />
        </div>
      </main>
    </>
  )
}
