import { Swords } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'
import { TierList } from '@/components/tier-list'

type VanillaRanking = { name: string; rank: number; tier?: string }
const lastKnownVanillaRanking: VanillaRanking[] = [
  { name: 'gmm_youtube', rank: 1, tier: 'HT1' },
]

async function getVanillaRanking(): Promise<{ ranking: VanillaRanking[]; isStale: boolean }> {
  try {
    const response = await fetch('http://localhost:3001/api/ranking', { cache: 'no-store' })
    if (!response.ok) return { ranking: lastKnownVanillaRanking, isStale: true }

    const data: unknown = await response.json()
    if (!Array.isArray(data)) return { ranking: lastKnownVanillaRanking, isStale: true }

    const ranking = data.filter(
      (player): player is VanillaRanking =>
        typeof player === 'object' &&
        player !== null &&
        'name' in player &&
        typeof player.name === 'string' &&
        'rank' in player &&
        typeof player.rank === 'number' &&
        (!('tier' in player) || typeof player.tier === 'string'),
    )
    if (ranking.length === 0) return { ranking: lastKnownVanillaRanking, isStale: true }

    return { ranking, isStale: false }
  } catch {
    return { ranking: lastKnownVanillaRanking, isStale: true }
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
