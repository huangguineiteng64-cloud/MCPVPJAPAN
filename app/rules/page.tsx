'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'
import { cn } from '@/lib/utils'

const tierPoints = [
  {
    tier: 'Tier 1',
    icon: '/icons/silver.png',
    color: '#facc15',
    glow: 'drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]',
    high: 'HT1',
    highPoints: 60,
    low: 'LT1',
    lowPoints: 45,
  },
  {
    tier: 'Tier 2',
    icon: '/icons/gold.png',
    color: '#dfe6ee',
    glow: 'drop-shadow-[0_0_10px_rgba(223,230,238,0.8)]',
    high: 'HT2',
    highPoints: 30,
    low: 'LT2',
    lowPoints: 20,
  },
  {
    tier: 'Tier 3',
    icon: '/icons/copper.png',
    color: '#d68a5d',
    glow: 'drop-shadow-[0_0_12px_rgba(214,138,93,0.85)]',
    high: 'HT3',
    highPoints: 10,
    low: 'LT3',
    lowPoints: 6,
  },
  {
    tier: 'Tier 4',
    icon: '/icons/tier4.png',
    color: '#a9b9d9',
    glow: 'drop-shadow-[0_0_12px_rgba(169,185,217,0.85)]',
    high: 'HT4',
    highPoints: 4,
    low: 'LT4',
    lowPoints: 3,
  },
  {
    tier: 'Tier 5',
    icon: '/icons/tier5.png',
    color: '#93a2bc',
    glow: 'drop-shadow-[0_0_10px_rgba(147,162,188,0.8)]',
    high: 'HT5',
    highPoints: 2,
    low: 'LT5',
    lowPoints: 1,
  },
]

const tabs = [
  { id: 'tier-points', label: 'Tier Points' },
  { id: 'overall-rules', label: '総合ルール' },
] as const

type RuleBlock = {
  heading: string
  paragraphs?: string[]
  items?: string[]
  subsections?: {
    heading: string
    paragraphs?: string[]
    items?: string[]
  }[]
}

const communityRules: RuleBlock[] = [
  {
    heading: '第1条（目的）',
    paragraphs: [
      '本コミュニティルール（以下「本ルール」といいます。）は、本Minecraftサーバーおよび関連サービス（Discordサーバー、Webサイト等を含む）を、すべての利用者が安全かつ快適に利用できる環境を維持することを目的として定めるものです。',
      'Discord認証BOTによる認証を完了した時点で、本ルールに同意したものとみなします。',
      '認証後に本Minecraftサーバーおよび関連サービスを利用する場合は、本ルールを遵守するものとします。',
    ],
  },
  {
    heading: '第2条（適用範囲）',
    paragraphs: ['本ルールは以下のすべてに適用されます。'],
    items: [
      'Minecraftサーバー',
      'Discordサーバー',
      '公式Webサイト',
      'SNSなどの公式コミュニティ',
      'その他運営が管理するサービス',
    ],
  },
  {
    heading: '第3条（利用者の責任）',
    paragraphs: ['利用者は以下を遵守してください。'],
    items: [
      '他者への敬意を持って行動すること',
      '本ルールを遵守すること',
      '自身のアカウントを適切に管理すること',
      '不具合や問題を発見した場合は速やかに報告すること',
    ],
  },
  {
    heading: '第4条（禁止事項）',
    paragraphs: ['利用者は以下の行為を行ってはいけません。'],
    subsections: [
      {
        heading: '4-1 ハラスメント行為',
        items: ['暴言', '誹謗中傷', '脅迫', '執拗な嫌がらせ', '差別的発言', '過度な挑発', '他者を精神的に追い詰める行為'],
        paragraphs: ['ゲーム内だけでなく、Discord・VC・DM・SNSなど、本コミュニティに関連する場で行われた行為も対象となる場合があります。'],
      },
      {
        heading: '4-2 スパム・荒らし',
        items: ['同じ内容の連投', '無意味な文字列の送信', 'チャット妨害', 'ボイスチャットでの騒音', '大量メンション', 'BOTの悪用', '意図的なチャンネル妨害'],
      },
      {
        heading: '4-3 不適切なコンテンツ',
        paragraphs: ['以下の投稿は禁止します。'],
        items: ['公序良俗に反する内容', '過度に暴力的な内容', '他人が不快になる画像・動画', '違法行為を助長する内容', '個人情報', '著作権を侵害するコンテンツ'],
      },
      {
        heading: '4-4 宣伝行為',
        paragraphs: ['運営の許可なく以下を行うことは禁止します。'],
        items: ['他サーバーへの勧誘', 'Discord招待リンクの投稿', 'YouTube・配信・SNSの宣伝', '商品販売', 'アフィリエイト'],
        paragraphs: ['運営が許可した場所での宣伝はこの限りではありません。'],
      },
      {
        heading: '4-5 不快なコメント',
        paragraphs: ['以下のような、他者を不快にさせることを目的とした発言を禁止します。'],
        items: ['冷笑コメント', '相手を馬鹿にする発言', '見下すような発言', '過度な皮肉や嫌味', '煽り行為', '意図的に相手を不快にさせる発言'],
        paragraphs: ['冗談のつもりであっても、相手や運営が不適切と判断した場合は違反となる場合があります。'],
      },
    ],
  },
  {
    heading: '第5条（アカウント）',
    paragraphs: ['利用者は以下を守ってください。'],
    items: ['他人へのアカウント貸与は禁止', '他人のアカウント利用は禁止', 'なりすましは禁止', '処分回避目的の別アカウント利用は禁止'],
  },
  {
    heading: '第6条（Discord）',
    paragraphs: ['Discordでは以下を守ってください。'],
    items: ['チャンネル用途を守る', '適切な言葉遣いを心掛ける', '無断DM勧誘は禁止', 'スタッフへの迷惑行為は禁止', 'VC荒らしは禁止'],
  },
  {
    heading: '第7条（個人情報）',
    items: ['本名の公開', '住所の公開', '電話番号の公開', 'メールアドレスの公開', 'その他個人情報の投稿'],
    paragraphs: ['本人の許可なく第三者の情報を公開した場合、重大な違反として扱います。'],
  },
  {
    heading: '第8条（運営）',
    paragraphs: ['運営は公平なサーバー運営に努めます。', '運営は以下の権限を有します。'],
    items: ['調査', 'ログ確認', '警告', 'キック', 'ミュート', '一時利用停止', '永久利用停止', '投稿削除', 'その他必要と判断した措置'],
    subsections: [{ heading: '', paragraphs: ['運営判断について個別の説明を行わない場合があります。'] }],
  },
  {
    heading: '第9条（違反への対応）',
    paragraphs: ['違反内容に応じて、注意・警告・ミュート・キック・一時利用停止・永久利用停止などの措置を行います。', '悪質な違反については、警告なしで永久利用停止となる場合があります。'],
  },
  {
    heading: '第10条（免責事項）',
    paragraphs: ['運営は利用者間のトラブル、通信障害、サーバーダウン、データ消失、外部サービスの障害、天災などによるサービス停止について責任を負いません。'],
  },
  {
    heading: '第11条（規約変更）',
    paragraphs: ['運営は必要に応じて本ルールを変更できます。', '変更後のルールは、公式WebサイトまたはDiscordで公開した時点から効力を有します。'],
  },
  {
    heading: '追記',
    paragraphs: [
      '運営は必要に応じて、ルールにない内容であっても、不適切だと判断すれば、BANなどの処置を取ることができます。',
      'BANされた人について理由を雑談で推測し、それにより秩序が乱れたと運営が判断した場合、1回目は1日間のタイムアウト、2回目以降はBAN処分とします。',
      'このサーバーにいる時点で、上記のルールに同意しているものとみなします。',
    ],
  },
]

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('overall-rules')

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-5xl px-4 pt-4 md:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2 border-b border-red-500/20 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200/80">
            <ShieldCheck className="size-3.5" />
            <span>Rules</span>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:p-6">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const selected = activeTab === tab.id
                const icon = tab.id === 'tier-points' ? '/icons/overall.png' : '/icons/sword.png'

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'relative inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200',
                      selected
                        ? 'border-red-500/40 bg-red-500/10 text-white shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                        : 'border-border bg-black/20 text-muted-foreground hover:border-red-500/20 hover:text-foreground',
                    )}
                  >
                    <img src={icon} alt={tab.label} className="size-5 object-contain" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {activeTab === 'tier-points' ? (
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-black text-white">Tierポイント</h1>
                </div>

                <div className="overflow-hidden rounded-xl border border-red-500/20 bg-zinc-950/70">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-zinc-200">
                      <thead className="bg-zinc-900/90 text-xs uppercase tracking-[0.18em] text-zinc-400">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Tier</th>
                          <th className="px-4 py-3 font-semibold">High</th>
                          <th className="px-4 py-3 font-semibold">Points</th>
                          <th className="px-4 py-3 font-semibold">Low</th>
                          <th className="px-4 py-3 font-semibold">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tierPoints.map(({ tier, icon, color, glow, high, highPoints, low, lowPoints }) => (
                          <tr key={tier} className="border-t border-zinc-800 bg-zinc-950/60">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={icon} alt={tier} className="size-12 object-contain" />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn('text-lg font-black tracking-[0.18em]', glow)}
                                style={{ color }}
                              >
                                {high}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-black text-white">{highPoints}</td>
                            <td className="px-4 py-3">
                              <span
                                className={cn('text-lg font-black tracking-[0.18em]', glow)}
                                style={{ color }}
                              >
                                {low}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-black text-white">{lowPoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <article className="space-y-7">
                <header className="border-b border-zinc-800 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300/80">Rules</p>
                  <h1 className="mt-2 text-3xl font-black text-white">コミュニティルール・利用規約</h1>
                  <p className="mt-2 text-sm text-zinc-400">最終更新日：2026年8月5日</p>
                </header>

                <div className="space-y-7 text-sm leading-7 text-zinc-300">
                  {communityRules.map((section) => (
                    <section key={section.heading} className="border-b border-zinc-800 pb-6 last:border-0">
                      <h2 className="text-lg font-bold text-white">{section.heading}</h2>
                      {section.paragraphs && (
                        <div className="mt-2 space-y-2">
                          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                      )}
                      {section.items && (
                        <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-red-300">
                          {section.items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      )}
                      {section.subsections && (
                        <div className="mt-5 space-y-5">
                          {section.subsections.map((subsection, index) => (
                            <div key={`${section.heading}-${index}`}>
                              {subsection.heading && <h3 className="font-semibold text-red-100">{subsection.heading}</h3>}
                              {subsection.paragraphs && (
                                <div className="mt-2 space-y-2">
                                  {subsection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                                </div>
                              )}
                              {subsection.items && (
                                <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-red-300">
                                  {subsection.items.map((item) => <li key={item}>{item}</li>)}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
