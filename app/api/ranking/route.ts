import { NextResponse } from 'next/server'
import { fetchRanking } from '@/lib/ranking-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const ranking = await fetchRanking()
    return NextResponse.json(ranking, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Failed to fetch ranking data:', error)
    const isConfigurationError =
      error instanceof Error && error.message.startsWith('RANKING_API_URL')
    return NextResponse.json(
      { error: 'ランキングAPIから取得できませんでした' },
      { status: isConfigurationError ? 503 : 502 },
    )
  }
}