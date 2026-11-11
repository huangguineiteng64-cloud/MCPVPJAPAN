'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Crown, House, ScrollText } from 'lucide-react'
import { PlayerSearch } from '@/components/player-search'

const DISCORD_URL = 'https://discord.gg/eEYKdQUXT'

const navItems = [
  { label: 'ホーム', href: '/', icon: House },
  { label: 'ティアリスト', href: '/tier', icon: Crown },
  { label: 'ルール', href: '/rules', icon: ScrollText },
]

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-400/20 bg-[linear-gradient(180deg,rgba(8,18,42,0.97),rgba(3,10,27,0.97))] shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-t border-white/10 px-2 sm:px-6">
        <nav aria-label="メイン" className="min-w-0 justify-self-end">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-200 transition-colors hover:border-slate-300/40 hover:bg-white/10 hover:text-white sm:size-10 lg:flex lg:h-12 lg:w-auto lg:gap-2 lg:px-3"
                >
                  <item.icon className="size-6 sm:size-7 lg:size-6" aria-hidden="true" />
                  <span className="hidden whitespace-nowrap text-sm font-medium lg:inline">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          className="relative z-10 col-start-2 flex size-16 items-center justify-center rounded-xl border border-slate-400/30 bg-[#030a27] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.55)] ring-1 ring-white/5 sm:size-20 lg:size-24"
          aria-label="MCPVPJAPAN ホーム"
        >
          <Image
            src="/icons/MCPVP JAPAN.png"
            alt=""
            width={96}
            height={96}
            className="size-full object-contain"
            priority
          />
        </Link>

        <div className="col-start-3 flex items-center justify-self-start">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-2 text-xs text-slate-200 transition-colors hover:border-slate-300/40 hover:bg-white/10 hover:text-white sm:h-12 sm:gap-2 sm:px-4 sm:text-base"
          >
            <DiscordIcon className="size-5 text-slate-300 sm:size-7" />
            <span>Discord</span>
            <span className="sr-only">（新しいタブで公式Discordサーバーを開く）</span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/[0.06] bg-[#030a27]/70 px-4 py-3">
        <div className="mx-auto max-w-md">
          <PlayerSearch />
        </div>
      </div>
    </header>
  )
}
