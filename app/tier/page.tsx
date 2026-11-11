import { Swords } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'
import { TierList } from '@/components/tier-list'
import { fetchRanking, type RankingPlayer } from '@/lib/ranking-api'
import { knownTieredPlayers } from '@/lib/tiered-players'

async function getVanillaRanking(): Promise<{ ranking: RankingPlayer[]; isStale: boolean }> {
  try {
    const ranking = await fetchRanking()
    if (ranking.length === 0) return { ranking: knownTieredPlayers, isStale: true }

    return { ranking, isStale: false }
  } catch (error) {
    console.error('Failed to load the vanilla ranking:', error)
    return { ranking: knownTieredPlayers, isStale: true }
  }
}

export default async function TierPage() {
  const { ranking: vanillaRanking, isStale } = await getVanillaRanking()

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2 border-b border-red-500/20 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200/80">
            <Swords className="size-3.5" />
            <span>Tier</span>
          </div>
          <TierList vanillaRanking={vanillaRanking} initialIsStale={isStale} />
        </div>
      </main>
    </>
  )
}
