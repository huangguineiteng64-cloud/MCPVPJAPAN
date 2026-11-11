'use client'

import { useEffect, useState } from 'react'
import { PodiumSkin } from '@/components/podium-skin'

type RankingPlayer = { name: string; rank: number }

const knownFirstPlace: RankingPlayer = { name: 'gmm_youtube', rank: 1 }

const podiumPlaces = [
  { rank: 2, label: '2位', height: 'h-56 sm:h-64', tone: 'silver' },
  { rank: 1, label: '1位', height: 'h-64 sm:h-72', tone: 'gold' },
  { rank: 3, label: '3位', height: 'h-48 sm:h-56', tone: 'bronze' },
] as const

function isRankingPlayer(value: unknown): value is RankingPlayer {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'rank' in value &&
    typeof value.rank === 'number'
  )
}

export function TopThreePodium() {
  const [players, setPlayers] = useState<RankingPlayer[]>([knownFirstPlace])

  useEffect(() => {
    let disposed = false
    const controller = new AbortController()

    async function loadRanking() {
      try {
        const response = await fetch('/api/ranking', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Ranking API returned HTTP ${response.status}`)

        const data: unknown = await response.json()
        if (!Array.isArray(data) || !data.every(isRankingPlayer)) {
          throw new Error('Ranking API returned invalid data')
        }

        if (!disposed) {
          const topPlayers = data.filter((player) => player.rank >= 1 && player.rank <= 3)
          if (!topPlayers.some((player) => player.rank === 1)) topPlayers.push(knownFirstPlace)
          setPlayers(topPlayers)
        }
      } catch (error) {
        if (!disposed && !(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to load the top players:', error)
        }
      }
    }

    void loadRanking()
    return () => {
      disposed = true
      controller.abort()
    }
  }, [])

  return (
    <section
      aria-labelledby="top-rankings-title"
      className="relative mx-auto mb-8 max-w-5xl overflow-hidden rounded-2xl border border-slate-500/20 bg-[radial-gradient(ellipse_at_50%_80%,rgba(59,130,246,0.12),transparent_42%),linear-gradient(180deg,rgba(10,19,37,0.96),rgba(5,11,24,0.98))] px-4 pb-5 pt-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:px-8 sm:pb-8 sm:pt-7"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-1/3 size-1 rounded-full bg-white/70 shadow-[0_0_10px_3px_rgba(255,255,255,0.25)]" />
        <div className="absolute right-[15%] top-1/4 size-1 rounded-full bg-amber-100/70 shadow-[0_0_10px_3px_rgba(255,255,255,0.2)]" />
        <div className="absolute left-1/4 top-[18%] size-0.5 rounded-full bg-white/60" />
        <div className="absolute right-1/4 top-[42%] size-0.5 rounded-full bg-white/60" />
      </div>

      <h1
        id="top-rankings-title"
        className="relative mb-4 text-center text-xl font-black tracking-wider text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)] sm:mb-5 sm:text-2xl"
      >
        トップ選手
      </h1>

      <div className="relative mx-auto grid max-w-xl grid-cols-3 items-end gap-3 sm:gap-6">
        {podiumPlaces.map(({ rank, label, height, tone }) => {
          const player = players.find((candidate) => candidate.rank === rank)
          const colors = {
            gold: {
              text: 'text-yellow-300',
              surface:
                'border-yellow-300/25 bg-gradient-to-b from-black/90 via-black/80 to-yellow-500/20 shadow-[0_0_32px_rgba(250,204,21,0.18)]',
              number: 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]',
            },
            silver: {
              text: 'text-slate-200',
              surface:
                'border-slate-300/20 bg-gradient-to-b from-black/90 via-black/80 to-slate-300/20 shadow-[0_0_24px_rgba(203,213,225,0.1)]',
              number: 'text-slate-200 drop-shadow-[0_0_10px_rgba(226,232,240,0.35)]',
            },
            bronze: {
              text: 'text-orange-300',
              surface:
                'border-orange-400/20 bg-gradient-to-b from-black/90 via-black/80 to-orange-500/20 shadow-[0_0_24px_rgba(249,115,22,0.1)]',
              number: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.35)]',
            },
          }[tone]

          return (
            <article key={rank} className="flex min-w-0 flex-col items-center">
              <p
                className={`mb-2 min-h-5 w-full truncate text-center text-xs font-extrabold sm:text-sm ${colors.text}`}
                title={player?.name}
              >
                {player?.name ?? ''}
              </p>
              <div
                className={`relative flex w-full flex-col items-center overflow-hidden rounded-t-xl border px-1 pt-2 ${height} ${colors.surface}`}
              >
                {player && (
                  <div className="-translate-y-2 h-[75%] min-h-0 w-full drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]">
                    <PodiumSkin playerName={player.name} />
                  </div>
                )}
                <span
                  aria-label={label}
                  className={`mt-auto pb-2 text-4xl font-black italic leading-none sm:pb-3 sm:text-5xl ${colors.number}`}
                >
                  {rank}
                </span>
              </div>
              <div
                aria-hidden="true"
                className={`h-2 w-full rounded-b-sm ${
                  tone === 'gold'
                    ? 'bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-700'
                    : tone === 'silver'
                      ? 'bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500'
                      : 'bg-gradient-to-r from-orange-800 via-orange-400 to-orange-800'
                }`}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}
