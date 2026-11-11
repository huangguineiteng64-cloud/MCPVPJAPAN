export type RankingPlayer = { name: string; rank: number; tier?: string }

function isRankingPlayer(value: unknown): value is RankingPlayer {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'rank' in value &&
    typeof value.rank === 'number' &&
    (!('tier' in value) || typeof value.tier === 'string')
  )
}

export function getRankingApiUrl() {
  const configuredUrl =
    process.env.RANKING_API_URL ??
    (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001/api/ranking')

  if (!configuredUrl) {
    throw new Error('RANKING_API_URL must be set to the ranking service URL')
  }

  const url = new URL(configuredUrl)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('RANKING_API_URL must use HTTP or HTTPS')
  }

  return url
}

export async function fetchRanking(): Promise<RankingPlayer[]> {
  const response = await fetch(getRankingApiUrl(), { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Ranking API returned HTTP ${response.status}`)
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Ranking API returned invalid data')
  }

  const ranking = data.filter(isRankingPlayer)
  if (data.length > 0 && ranking.length === 0) {
    throw new Error('Ranking API returned no valid players')
  }

  return ranking
}
