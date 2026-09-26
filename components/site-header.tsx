'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Home, Menu, Search, ShieldCheck, Swords, UserRound, X } from 'lucide-react'

const DISCORD_URL = 'https://discord.com/oauth2/authorize?client_id=1531968068513824910&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&scope=identify+guilds.members.read+rpc+applications.commands.permissions.update'

const navItems = [
  { label: 'ホーム', href: '/', icon: Home },
  { label: 'ティア', href: '/tier', icon: Swords },
  { label: 'ルール', href: '/rules', icon: ShieldCheck },
]

const playerSearchData: Array<{ name: string; tier: string }> = []

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filteredPlayers = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return []

    return playerSearchData.filter(
      (player) =>
        player.name.toLowerCase().includes(value) || player.tier.toLowerCase().includes(value),
    )
  }, [query])

  return (
    <header className="sticky top-0 z-50 border-b border-red-500/20 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="MCPVPJAPAN ホーム">
          <div className="flex size-12 items-center justify-center rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/80 via-black to-zinc-900 p-1 shadow-[0_0_18px_rgba(239,68,68,0.45)]">
            <Image
              src="/icons/MCPVP JAPAN.png"
              alt="MCPVP JAPAN"
              width={48}
              height={48}
              className="size-full object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.65)]"
              priority
            />
          </div>
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-red-300/80" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Player Search"
              aria-label="プレイヤー検索"
              className="w-full rounded-full border border-red-500/25 bg-zinc-950/80 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-zinc-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            />

            {query.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/95 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.slice(0, 6).map((player) => (
                    <button
                      key={player.name}
                      type="button"
                      onClick={() => setQuery(player.name)}
                      className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-red-500/10"
                    >
                      <span className="flex size-8 items-center justify-center rounded-full bg-red-500/15 text-red-300">
                        <UserRound className="size-4" />
                      </span>
                      <span className="flex-1 text-sm font-semibold text-white">{player.name}</span>
                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-200">
                        {player.tier}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-3 text-sm text-zinc-400">該当するプレイヤーが見つかりませんでした</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 justify-center md:hidden">
          <div className="relative w-full max-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-red-300/80" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Player Search"
              aria-label="プレイヤー検索"
              className="w-full rounded-full border border-red-500/25 bg-zinc-950/80 py-2 pl-9 pr-3 text-sm text-white placeholder:text-zinc-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            />

            {query.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-950/95 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.slice(0, 5).map((player) => (
                    <button
                      key={player.name}
                      type="button"
                      onClick={() => setQuery(player.name)}
                      className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-red-500/10"
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-red-500/15 text-red-300">
                        <UserRound className="size-3.5" />
                      </span>
                      <span className="flex-1 text-xs font-semibold text-white">{player.name}</span>
                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase text-red-200">
                        {player.tier}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-zinc-400">該当なし</div>
                )}
              </div>
            )}
          </div>
        </div>

        <nav aria-label="メイン" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <DiscordIcon className="size-3.5" />
            <span>Discord</span>
            <span className="sr-only">（新しいタブで公式Discordサーバーを開く）</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="モバイル" className="border-t border-border md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
