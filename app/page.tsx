import Image from 'next/image'
import Link from 'next/link'
import { Home } from 'lucide-react'

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
          <section className="relative overflow-hidden rounded-none border-0 bg-transparent shadow-none">
            <Link href="/tier" className="group block overflow-hidden">
              <Image
                src="/icons/ranking home2.png"
                alt="ランキングサイトホーム"
                width={1600}
                height={900}
                priority
                className="mx-auto block h-auto max-h-[28vh] w-full object-contain object-center transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.35)] sm:max-h-[32vh] md:max-h-[36vh] lg:max-h-[40vh]"
              />
            </Link>

            <Link href="/rules" className="group mt-0 block overflow-hidden">
              <Image
                src="/icons/ranking home3.png"
                alt="ランキングサイトホーム 下部"
                width={1600}
                height={900}
                className="mx-auto block h-auto max-h-[28vh] w-full object-contain object-center transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.35)] sm:max-h-[32vh] md:max-h-[36vh] lg:max-h-[40vh]"
              />
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}
