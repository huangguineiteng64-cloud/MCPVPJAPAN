import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Swords, Trophy } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { MinecraftSkin } from '@/components/minecraft-skin'
import { SiteHeader } from '@/components/site-header'
import { getTieredPlayers } from '@/lib/tiered-players'

export const dynamic = 'force-dynamic'

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const { players } = await getTieredPlayers()
  const player = players.find((candidate) => candidate.name.toLowerCase() === username.toLowerCase())

  if (!player) notFound()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-2xl px-4 py-8">
        <Link
          href="/tier"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          ランキング一覧へ戻る
        </Link>

        <section
          aria-labelledby="player-name"
          className="aspect-[9/16] overflow-hidden rounded-2xl border border-slate-500/20 bg-[radial-gradient(ellipse_at_50%_8%,rgba(100,116,139,0.14),transparent_36%),linear-gradient(180deg,#121a27,#111923)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-10"
        >
          <div className="flex flex-col items-center text-center">
            <div className="grid size-32 place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_38%,#263449,#192332_68%,#141c29)] shadow-[0_8px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/5">
              <MinecraftSkin playerName={player.name} profile />
            </div>
            <h1 id="player-name" className="mt-2 break-all text-2xl font-black text-slate-100 sm:text-3xl">
              {player.name}
            </h1>
            <a
              href={`https://namemc.com/profile/${encodeURIComponent(player.name)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700"
            >
              <span className="grid size-5 place-items-center rounded bg-black text-[10px] font-black text-white">
                N
              </span>
              NameMC
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>

          <section aria-labelledby="player-position" className="mt-7">
            <h2 id="player-position" className="mb-2 flex items-center gap-2 text-lg font-medium text-slate-300">
              <Swords className="size-4" aria-hidden="true" />
              POSITION
            </h2>
            <div className="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950/25">
              <span className="border-r-2 border-slate-700 bg-slate-700/50 px-3 py-1.5 text-2xl font-black italic text-white sm:text-3xl">
                {player.rank}.
              </span>
              <span className="flex items-center gap-2 px-3 text-base font-bold text-slate-100 sm:text-lg">
                <Trophy className="size-5 shrink-0 text-amber-400" aria-hidden="true" />
                RANKING
              </span>
            </div>
          </section>

          <section aria-labelledby="player-tiers" className="mt-6">
            <h2 id="player-tiers" className="mb-2 text-lg font-medium text-slate-300">
              TIERS
            </h2>
            <div className="grid grid-cols-4 gap-2 rounded-lg border border-slate-700 bg-slate-950/25 p-3">
              <div className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg bg-slate-800/45 p-2">
                <span className="grid size-8 place-items-center rounded-full border border-slate-700 bg-slate-950/80">
                  <Image
                    src="/icons/クリスタル　アイコン.png"
                    alt="Vanilla"
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                  />
                </span>
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-bold text-amber-300">
                  {player.tier}
                </span>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  )
}
