import { fetchRanking, type RankingPlayer } from '@/lib/ranking-api'

export const knownTieredPlayers: RankingPlayer[] = [
  { name: 'gmm_youtube', rank: 1, tier: 'HT1' },
]

export async function getTieredPlayers(): Promise<{
  players: RankingPlayer[]
  isStale: boolean
}> {
  try {
    const ranking = await fetchRanking()
    const playersByName = new Map(
      knownTieredPlayers.map((player) => [player.name.toLowerCase(), player]),
    )

    for (const player of ranking) {
      if (!player.tier) continue
      const key = player.name.toLowerCase()
      const knownPlayer = playersByName.get(key)
      playersByName.set(key, knownPlayer ? { ...knownPlayer, ...player } : player)
    }

    return {
      players: [...playersByName.values()].sort((first, second) => first.rank - second.rank),
      isStale: false,
    }
  } catch (error) {
    console.error('Failed to load tiered players:', error)
    return { players: knownTieredPlayers, isStale: true }
  }
}
