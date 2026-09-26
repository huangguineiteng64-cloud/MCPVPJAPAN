import { SiteHeader } from '@/components/site-header'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-7xl px-4 pt-1 md:px-6 lg:px-8">
          <section className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-zinc-900/80 via-black to-zinc-950 px-6 py-12 text-center shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
            <div>
              <h1 className="text-3xl font-black text-white md:text-5xl">MCPVP JAPAN</h1>
              <p className="mt-3 text-sm text-zinc-300 md:text-base">
                公式ページへようこそ。上部メニューから Tier や Rules をご確認ください。
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
