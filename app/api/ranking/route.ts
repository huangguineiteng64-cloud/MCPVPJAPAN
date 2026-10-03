import { NextResponse } from 'next/server'

type RankingPlayer = { name: string; rank: number; tier?: string }

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetch('http://localhost:3001/api/ranking', { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json({ error: 'ランキングAPIから取得できませんでした' }, { status: 502 })
    }

    const data: unknown = await response.json()
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'ランキングデータの形式が不正です' }, { status: 502 })
    }

    const ranking = data.filter(
      (player): player is RankingPlayer =>
        typeof player === 'object' &&
        player !== null &&
        'name' in player &&
        typeof player.name === 'string' &&
        'rank' in player &&
        typeof player.rank === 'number' &&
        (!('tier' in player) || typeof player.tier === 'string'),
    )

    return NextResponse.json(ranking, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'ランキングAPIに接続できませんでした' }, { status: 502 })
  }
}