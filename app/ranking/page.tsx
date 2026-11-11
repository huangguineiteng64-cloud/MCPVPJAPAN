import { fetchRanking, type RankingPlayer } from "@/lib/ranking-api";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  let ranking: RankingPlayer[] | null;

  try {
    ranking = await fetchRanking();
  } catch (error) {
    console.error("Failed to load the ranking page:", error);
    ranking = null;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-7xl p-4">
        <h1 className="mb-4 text-2xl font-bold">Ranking</h1>

        {ranking === null ? (
          <p className="text-muted-foreground">ランキングを取得できませんでした。時間をおいて再度お試しください。</p>
        ) : ranking.length === 0 ? (
          <p className="text-muted-foreground">まだランクインしているプレイヤーはいません</p>
        ) : null}

        {ranking !== null && (
          <ul className="space-y-2">
            {ranking.map((player) => (
              <li key={player.name} className="rounded-lg border border-slate-400/20 bg-[#0b162b]/80 p-3">
                {player.rank}位 - {player.name}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
