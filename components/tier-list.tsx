'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronsUp, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinecraftSkin } from '@/components/minecraft-skin'

type Mode = { id: string; label: string; icon: string }
type VanillaRanking = { name: string; rank: number; tier?: string }
const rankingRefreshInterval = 30_000

const modes: Mode[] = [
  { id: 'overall', label: 'Overall', icon: 'overall' },
  { id: 'java-overall', label: 'Java Overall', icon: 'overall' },
  { id: 'bedrock-overall', label: '統合版 Overall', icon: 'overall' },
  { id: 'vanilla', label: 'Vanilla', icon: 'クリスタル　アイコン' },
  { id: 'uhc', label: 'UHC', icon: 'uhc' },
  { id: 'pot', label: 'Pot', icon: 'ポット　アイコン２' },
  { id: 'nethop', label: 'NethOP', icon: 'nethop' },
  { id: 'smp', label: 'SMP', icon: 'smp' },
  { id: 'sword', label: 'Sword', icon: 'sword' },
  { id: 'axe', label: 'Axe', icon: 'axe' },
  { id: 'mace', label: 'Mace', icon: 'mace' },
  { id: 'midfight', label: 'Mid Fight', icon: 'midfight' },
  { id: 'sg', label: 'SG', icon: 'sg' },
  { id: 'skywars', label: 'SkyWars', icon: 'SKY WARS' },
  { id: 'bedfight', label: 'BedFight', icon: 'betwars' },
  { id: 'buhc', label: 'BUHC', icon: 'buhc' },
  { id: 'creeper', label: 'Creeper', icon: 'creeper' },
  { id: 'cart', label: 'Cart', icon: 'cart' },
  { id: 'spear', label: 'Spear', icon: 'spear' },
]

const summaryModeIds = ['overall', 'java-overall', 'bedrock-overall']
const summaryModes = modes.filter((mode) => summaryModeIds.includes(mode.id))
const bedrockOnlyModeIds = ['midfight', 'sg', 'skywars', 'bedfight', 'buhc']
const javaKitIds = ['vanilla', 'uhc', 'pot', 'nethop', 'smp', 'sword', 'axe', 'mace', 'creeper', 'cart', 'spear']
const bedrockKitIds = ['midfight', 'sg', 'skywars', 'bedfight', 'buhc']
const summaryKitModes = {
  overall: modes.filter((mode) => [...javaKitIds, ...bedrockKitIds].includes(mode.id)),
  'java-overall': modes.filter((mode) => javaKitIds.includes(mode.id)),
  'bedrock-overall': modes.filter((mode) => bedrockKitIds.includes(mode.id)),
}
const tierColumns = [
  { level: 1, label: 'Tier 1', color: 'gold' },
  { level: 2, label: 'Tier 2', color: 'silver' },
  { level: 3, label: 'Tier 3', color: 'bronze' },
  { level: 4, label: 'Tier 4', color: 'slate' },
  { level: 5, label: 'Tier 5', color: 'slate' },
] as const

function getTierLevel(tier?: string) {
  const match = tier?.match(/(?:^|\D)([1-5])(?:\D|$)/)
  return match ? Number(match[1]) : null
}

function preserveKnownTiers(ranking: VanillaRanking[], previousRanking: VanillaRanking[]) {
  const previousByName = new Map(previousRanking.map((player) => [player.name, player]))
  const updatedRanking: VanillaRanking[] = ranking.map((player) => ({
    ...player,
    tier: player.tier || previousByName.get(player.name)?.tier,
  }))
  const includedNames = new Set(updatedRanking.map((player) => player.name))

  for (const player of previousRanking) {
    if (player.tier && !includedNames.has(player.name)) updatedRanking.push(player)
  }

  return updatedRanking.sort((first, second) => first.rank - second.rank)
}

export function TierList({
  vanillaRanking: initialVanillaRanking,
  initialIsStale,
}: {
  vanillaRanking: VanillaRanking[]
  initialIsStale: boolean
}) {
  const [vanillaRanking, setVanillaRanking] = useState(initialVanillaRanking)
  const vanillaRankingRef = useRef(initialVanillaRanking)
  const [rankingRefreshFailed, setRankingRefreshFailed] = useState(initialIsStale)
  const [activeSummary, setActiveSummary] = useState('overall')
  const [activeKit, setActiveKit] = useState('vanilla')

  const updateVanillaRanking = (ranking: VanillaRanking[]) => {
    vanillaRankingRef.current = ranking
    setVanillaRanking(ranking)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    let disposed = false
    const cacheKey = 'vanilla-ranking-cache'

    const refreshRanking = async () => {
      try {
        const response = await fetch('/api/ranking', { cache: 'no-store' })
        if (!response.ok) throw new Error('Ranking refresh failed')

        const data: unknown = await response.json()
        if (!Array.isArray(data)) throw new Error('Invalid ranking response')

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
        if (ranking.length === 0) throw new Error('Ranking response contained no players')

        if (!disposed) {
          const rankingWithKnownTiers = preserveKnownTiers(ranking, vanillaRankingRef.current)
          updateVanillaRanking(rankingWithKnownTiers)
          setRankingRefreshFailed(false)
          try {
            window.localStorage.setItem(cacheKey, JSON.stringify(rankingWithKnownTiers))
          } catch {
            // Keep the in-memory update even when browser storage is unavailable.
          }
        }
      } catch {
        if (!disposed) setRankingRefreshFailed(true)
      } finally {
        if (!disposed) timer = setTimeout(refreshRanking, rankingRefreshInterval)
      }
    }

    try {
      const cachedData = window.localStorage.getItem(cacheKey)
      if (cachedData) {
        const parsedData: unknown = JSON.parse(cachedData)
        if (Array.isArray(parsedData)) {
          const cachedRanking = parsedData.filter(
            (player): player is VanillaRanking =>
              typeof player === 'object' &&
              player !== null &&
              'name' in player &&
              typeof player.name === 'string' &&
              'rank' in player &&
              typeof player.rank === 'number' &&
              (!('tier' in player) || typeof player.tier === 'string'),
          )
          if (cachedRanking.length > 0) updateVanillaRanking(cachedRanking)
        }
      }
    } catch {
      // Ignore invalid or unavailable browser storage and use the server data.
    }

    void refreshRanking()

    return () => {
      disposed = true
      clearTimeout(timer)
    }
  }, [])

  const activeMode =
    modes.find((m) => m.id === activeKit) ??
    modes.find((m) => m.id === activeSummary) ??
    modes[0]

  const showsRankingList =
    activeMode.id === 'overall' ||
    activeMode.id === 'java-overall' ||
    activeMode.id === 'bedrock-overall'
  const activeSummaryKits =
    activeMode.id in summaryKitModes
      ? summaryKitModes[activeMode.id as keyof typeof summaryKitModes]
      : null
  const summaryKitRows = activeSummaryKits ? Math.ceil(activeSummaryKits.length / 8) : 0
  const firstVanillaTier = vanillaRanking.find((player) => player.rank === 1)?.tier || 'HT1'

  const regularModes = (() => {
    if (activeSummary === 'java-overall') {
      return modes.filter((mode) => !bedrockOnlyModeIds.includes(mode.id) && !summaryModeIds.includes(mode.id))
    }

    if (activeSummary === 'bedrock-overall') {
      return modes.filter((mode) => bedrockOnlyModeIds.includes(mode.id))
    }

    return modes.filter((mode) => !summaryModeIds.includes(mode.id))
  })()

  return (
    <section id="tiers" aria-labelledby="tiers-heading" className="mx-auto max-w-7xl py-1 md:py-1">
      <h2 id="tiers-heading" className="sr-only">
        ティアリスト
      </h2>

      <div className="flex flex-col gap-0">
        <div role="tablist" aria-label="全体モード" className="mt-1 flex gap-1.5 overflow-x-auto pb-0">
          {summaryModes.map((mode) => {
            const selected = mode.id === activeSummary

            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                id={`tab-${mode.id}`}
                aria-selected={selected}
                aria-controls="tier-panel"
                onClick={() => {
                  setActiveSummary(mode.id)
                  setActiveKit(mode.id)
                }}
                className={cn(
                  'relative flex min-w-[110px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-200',
                  selected
                    ? 'border-red-500/40 bg-red-500/10 text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                    : 'border-border bg-black/20 text-muted-foreground hover:border-red-500/20 hover:text-foreground',
                )}
              >
                <div
                  className={cn(
                    'relative flex size-8 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-slate-950/90 p-1 shadow-inner transition-transform duration-200 ease-out hover:scale-110',
                    !selected && 'bg-slate-900/75',
                  )}
                >
                  <Image
                    src={`/icons/${mode.icon}.png`}
                    alt=""
                    width={30}
                    height={30}
                    className={cn(
                      'size-full object-contain transition-transform duration-200 ease-out hover:scale-110',
                      !selected && 'opacity-60',
                    )}
                  />
                </div>
                <span className="leading-none">{mode.label}</span>
              </button>
            )
          })}
        </div>

        <div role="tablist" aria-label="ゲームモード" className="mt-1.5 flex gap-1.5 overflow-x-auto pb-px">
          {regularModes.map((mode) => {
            const selected = mode.id === activeKit

            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                id={`tab-${mode.id}`}
                aria-selected={selected}
                aria-controls="tier-panel"
                onClick={() => setActiveKit(mode.id)}
                className={cn(
                  'relative flex min-w-24 shrink-0 flex-col items-center gap-1 whitespace-nowrap rounded-t-xl border border-b-0 border-border px-4 pb-2 pt-3 text-sm font-semibold transition-colors',
                  selected
                    ? 'bg-card text-foreground shadow-[inset_0_-2px_0_0_var(--foreground)]'
                    : 'bg-card/40 text-muted-foreground hover:text-foreground',
                )}
              >
                <div
                  className={cn(
                    'relative flex size-12 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-slate-950/90 p-1 shadow-inner transition-transform duration-300 ease-out hover:scale-110',
                    !selected && 'bg-slate-900/75',
                  )}
                >
                  <Image
                    src={`/icons/${mode.icon}.png`}
                    alt=""
                    width={40}
                    height={40}
                    className={cn(
                      'size-full object-contain transition-transform duration-200 ease-out hover:scale-110',
                      !selected && 'opacity-60',
                    )}
                  />
                </div>
                <span className="mt-0.5 leading-none">{mode.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        id="tier-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeMode.id}`}
        className="rounded-b-2xl rounded-tr-2xl border border-red-500/20 bg-gradient-to-br from-zinc-900/90 via-zinc-950/95 to-black p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-6"
      >
        {showsRankingList ? (
          <div className={activeSummaryKits ? 'overflow-x-auto' : undefined}>
            <div className="space-y-0">
              {Array.from({ length: 100 }, (_, index) => index + 1).map((rank) => (
                <div
                  key={rank}
                  style={activeSummaryKits ? { height: `${summaryKitRows * 48 + 2.5}px` } : undefined}
                  className={cn(
                    'relative z-0 overflow-visible transition-transform duration-150 ease-out hover:z-10 hover:scale-[1.03] active:z-10 active:scale-[1.03]',
                    activeSummaryKits ? 'sm:!h-[50.5px]' : 'h-[50.5px]',
                  )}
                >
                  <div
                    style={activeSummaryKits ? { height: `${summaryKitRows * 48}px` } : undefined}
                    className={cn('overflow-hidden rounded-lg', activeSummaryKits ? 'sm:!h-12' : 'h-12')}
                  >
                    <div
                      className={cn(
                        'relative flex items-start overflow-hidden rounded-none bg-slate-800/90 text-foreground shadow-sm sm:items-center',
                        activeSummaryKits ? 'top-0 h-full flex-wrap sm:top-[-10px] sm:h-[68px] sm:flex-nowrap' : 'top-[-10px] h-[68px]',
                      )}
                    >
                      <div className={activeSummaryKits ? 'relative flex h-12 min-w-0 flex-1 sm:static sm:h-full sm:w-auto sm:flex-none' : 'contents'}>
                        <div
                          className={cn(
                            'relative z-[1] h-full w-36 shrink-0 [clip-path:polygon(0_0,100%_0,80%_100%,0_100%)] sm:w-48',
                            rank === 1 && 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400',
                            rank === 2 && 'bg-gradient-to-r from-slate-300 via-gray-200 to-slate-400',
                            rank === 3 && 'bg-gradient-to-r from-amber-700 via-orange-500 to-amber-800',
                            rank > 3 && 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600',
                          )}
                        >
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-4xl font-black italic text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.75)]">
                            {rank}.
                          </span>
                          {rank === 1 && (
                            <span className="absolute left-8 top-0.5 z-10 sm:left-16">
                              <MinecraftSkin />
                            </span>
                          )}
                        </div>
                        <div className={cn('z-[1] min-w-0', activeSummaryKits ? 'flex-1 sm:w-40 sm:shrink-0 sm:flex-none' : 'flex-1')}>
                          {rank === 1 && (
                            <div
                              className={cn(
                                activeSummaryKits
                                  ? 'absolute left-0 top-12 z-[2] flex h-12 w-36 items-center sm:relative sm:left-auto sm:top-auto sm:z-[1] sm:h-12 sm:w-auto'
                                  : 'relative flex h-12 items-center',
                              )}
                            >
                              <span className="truncate pl-2 text-sm font-bold text-slate-100 sm:text-2xl">
                                gmm_youtube
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {activeSummaryKits && (
                        <div className="ml-auto grid h-auto w-48 shrink-0 grid-cols-8 sm:ml-0 sm:flex sm:h-full sm:w-auto">
                          {activeSummaryKits.map((kit) => (
                            <div
                              key={kit.id}
                              title={kit.label}
                              className="flex h-12 w-full flex-col items-center justify-center gap-0.5 sm:h-full sm:w-12 sm:shrink-0 sm:gap-1"
                            >
                              <span className="flex size-[22px] items-center justify-center rounded-full border border-slate-600 bg-slate-900 sm:size-7">
                                <Image
                                  src={`/icons/${kit.icon}.png`}
                                  alt={kit.label}
                                  width={16}
                                  height={16}
                                  className="size-4 object-contain sm:size-5"
                                />
                              </span>
                              <span
                                className={cn(
                                  'flex h-4 min-w-6 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none sm:min-w-8',
                                  kit.id === 'vanilla'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-slate-700/80 text-slate-300',
                                )}
                              >
                                {rank === 1 && kit.id === 'vanilla' ? firstVanillaTier : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {!activeSummaryKits && (
                        <div className="z-[1] flex w-24 shrink-0 items-center justify-center gap-1.5 border-l border-slate-600/60 sm:w-28">
                          {rank === 1 && (
                            <>
                              <Image
                                src="/icons/クリスタル　アイコン.png"
                                alt="Vanilla"
                                width={28}
                                height={28}
                                className="size-7 shrink-0 object-contain"
                              />
                              <span className="truncate text-2xl font-black leading-none text-amber-300 [text-shadow:0_0_5px_rgba(251,191,36,0.9),0_0_12px_rgba(245,158,11,0.65)]">
                                HT1
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-5 gap-2">
              {tierColumns.map((column) => {
                const players =
                  activeMode.id === 'vanilla'
                    ? vanillaRanking
                        .filter((player) => getTierLevel(player.tier) === column.level)
                        .sort((first, second) => first.rank - second.rank)
                    : []

                return (
                  <section
                    key={column.level}
                    aria-labelledby={`tier-column-${column.level}`}
                    className="min-w-0 overflow-hidden rounded-t-2xl"
                  >
                    <h3
                      id={`tier-column-${column.level}`}
                      className={cn(
                        'flex h-[72px] items-center justify-center gap-2 text-2xl font-bold',
                        column.color === 'gold' && 'bg-amber-500/20 text-amber-400',
                        column.color === 'silver' && 'bg-slate-300/20 text-slate-300',
                        column.color === 'bronze' && 'bg-orange-700/20 text-orange-400',
                        column.color === 'slate' && 'bg-slate-800/60 text-slate-300',
                      )}
                    >
                      {column.level <= 3 && <Trophy className="size-6" aria-hidden="true" />}
                      {column.label}
                    </h3>
                    <div className="space-y-0.5">
                      {players.map((player) => (
                        <div
                          key={`${player.name}-${player.rank}`}
                          className="flex h-12 min-w-0 items-center gap-2 border-l-2 border-slate-500/70 bg-slate-700/70 px-3"
                        >
                          <Image
                            src={`https://mc-heads.net/avatar/${encodeURIComponent(player.name)}/32`}
                            alt=""
                            width={32}
                            height={32}
                            unoptimized
                            className="size-8 shrink-0 rounded-sm"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                            {player.name}
                          </span>
                          <ChevronsUp className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}

        {activeMode.id === 'vanilla' && (
          <p className="mt-3 text-right text-xs text-muted-foreground" aria-live="polite">
            {rankingRefreshFailed
              ? 'APIの確認に失敗しました。30秒後に再試行します。'
              : 'ランキングを30秒ごとに自動確認中'}
          </p>
        )}
      </div>
    </section>
  )
}
