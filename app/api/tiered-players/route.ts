import { NextResponse } from 'next/server'
import { getTieredPlayers } from '@/lib/tiered-players'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await getTieredPlayers()
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
