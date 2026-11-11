'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { RankingAvatar } from '@/components/ranking-avatar'

type RankingPlayer = { name: string; rank: number; tier?: string }

function isTieredPlayersResponse(
  value: unknown,
): value is { players: RankingPlayer[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'players' in value &&
    Array.isArray(value.players) &&
    value.players.every(
      (player) =>
        typeof player === 'object' &&
        player !== null &&
        'name' in player &&
        typeof player.name === 'string' &&
        'rank' in player &&
        typeof player.rank === 'number' &&
        'tier' in player &&
        typeof player.tier === 'string',
    )
  )
}

export function PlayerSearch() {
  const [query, setQuery] = useState('')
  const [players, setPlayers] = useState<RankingPlayer[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const hasQuery = query.trim().length > 0

  useEffect(() => {
    if (!hasQuery || players !== null || loadError) return

    const controller = new AbortController()
    void fetch('/api/tiered-players', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Tiered players API returned HTTP ${response.status}`)
        const data: unknown = await response.json()
        if (!isTieredPlayersResponse(data)) {
          throw new Error('Tiered players API returned invalid data')
        }
        setPlayers(data.players)
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to load players for search:', error)
          setLoadError(true)
        }
      })

    return () => controller.abort()
  }, [hasQuery, loadError, players])

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery || players === null) return []
    return players
      .filter((player) => player.name.toLocaleLowerCase().includes(normalizedQuery))
      .sort((first, second) => first.rank - second.rank)
  }, [players, query])

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-border bg-[#030a27]/80 px-3 py-2 shadow-inner">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16L21 21" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="プレイヤーを探す"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false)
          }}
          aria-label="プレイヤーを検索"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      {isOpen && hasQuery && (
        <div className="absolute inset-x-0 top-full z-[60] mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-[#071226] p-1 shadow-xl">
          {players === null && !loadError ? (
            <p className="px-3 py-2 text-sm text-muted-foreground" role="status">
              プレイヤーを検索中...
            </p>
          ) : loadError ? (
            <div className="flex items-center justify-between gap-3 px-3 py-2">
              <p className="text-sm text-red-300" role="status">
                検索結果を取得できませんでした
              </p>
              <button
                type="button"
                onClick={() => setLoadError(false)}
                className="shrink-0 text-xs text-amber-300 hover:text-amber-200"
              >
                再試行
              </button>
            </div>
          ) : matches.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground" role="status">
              該当するプレイヤーはいません
            </p>
          ) : (
            <>
              <ul aria-label="ティア取得済みプレイヤーの検索結果">
                {matches.slice(0, 10).map((player) => (
                  <li key={`${player.name}-${player.rank}`}>
                    <Link
                      href={`/player/${encodeURIComponent(player.name)}`}
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                      <RankingAvatar playerName={player.name} />
                      <span className="truncate">{player.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {matches.length > 10 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  他 {matches.length - 10} 人
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
