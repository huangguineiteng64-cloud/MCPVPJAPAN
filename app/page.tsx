import Image from 'next/image'
import Link from 'next/link'
import { BookOpenText, Home, Trophy } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)] pt-0">
        <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2 border-b border-red-500/20 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200/80">
            <Home className="size-3.5" />
            <span>Home</span>
          </div>
        </div>

        <div className="mx-auto max-w-none px-0 py-0">
          <section className="relative flex flex-col overflow-visible rounded-none border-0 bg-transparent shadow-none lg:grid lg:grid-cols-[12rem_minmax(16rem,1fr)] lg:items-center lg:gap-6 lg:px-6">
            <a
              href="https://discord.gg/RX5rVgmd8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DiscordでTierをゲットする"
              className="group relative mx-auto block size-48 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:mx-0"
            >
              <Image
                src="/icons/ranking home5.png"
                alt="ランキングサイトホーム"
                width={192}
                height={192}
                priority
                className="block size-48 object-contain object-center mix-blend-screen transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.55)] group-focus-visible:scale-[1.02] group-focus-visible:drop-shadow-[0_0_20px_rgba(255,255,255,0.55)]"
              />
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="home-image-shine absolute inset-y-[-20%] left-0 w-1/3 -skew-x-[22deg]" />
              </span>
            </a>

            <div className="flex flex-col gap-4 px-4 lg:px-0">
              <Link
                href="/tier"
                className="group flex min-h-20 items-center justify-center gap-4 border-2 border-red-500/50 bg-zinc-950 px-6 py-5 text-xl font-bold text-white shadow-[0_5px_0_#481a1a] transition hover:-translate-y-0.5 hover:bg-red-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-24 sm:text-2xl"
              >
                <Trophy className="size-7 shrink-0 transition-transform group-hover:scale-110 sm:size-8" />
                <span>ランキング</span>
              </Link>

              <Link
                href="/rules"
                className="group flex min-h-20 items-center justify-center gap-4 border-2 border-red-500/50 bg-zinc-950 px-6 py-5 text-xl font-bold text-white shadow-[0_5px_0_#481a1a] transition hover:-translate-y-0.5 hover:bg-red-950/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-24 sm:text-2xl"
              >
                <BookOpenText className="size-7 shrink-0 transition-transform group-hover:scale-110 sm:size-8" />
                <span>ルール</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
