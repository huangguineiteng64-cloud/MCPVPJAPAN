'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Mode = { id: string; label: string; icon: string }

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

export function TierList() {
  const [activeSummary, setActiveSummary] = useState('overall')
  const [activeKit, setActiveKit] = useState('overall')

  const activeMode =
    modes.find((m) => m.id === activeKit) ??
    modes.find((m) => m.id === activeSummary) ??
    modes[0]

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
        <div className="hidden grid-cols-[3rem_1fr_7rem_18rem] gap-4 px-4 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <span>#</span>
          <span>Player</span>
          <span className="text-center">Region</span>
          <span className="text-center">Tiers</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-slate-950/20 px-4 py-16 text-center md:px-6">
          <div className="flex size-14 items-center justify-center rounded-full border border-dashed border-border bg-slate-900/60 text-2xl text-muted-foreground">
            —
          </div>
          <p className="font-semibold">まだランクインしているプレイヤーはいません</p>
          <p className="text-sm text-muted-foreground">
            {activeMode.label} のティアテストを受けたプレイヤーがここに表示されます。
          </p>
        </div>
      </div>
    </section>
  )
}
