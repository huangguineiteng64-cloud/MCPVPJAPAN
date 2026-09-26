import { SiteHeader } from '@/components/site-header'

export default function RulesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300/80">Rules</p>
            <h1 className="mt-2 text-3xl font-black text-white">ルール</h1>

            <ul className="mt-6 space-y-4 text-sm text-zinc-300">
              <li>• ルールはサイトに合わせて随時更新されます。</li>
              <li>• 不正行為やチート利用は禁止です。</li>
              <li>• トーナメントやランキングに関する詳細は運営までご確認ください。</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}
