import { fetchRanking, type RankingPlayer } from "@/lib/ranking-api";

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
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-bold mb-4">Ranking</h1>

      {ranking === null ? (
        <p className="text-gray-400">ランキングを取得できませんでした。時間をおいて再度お試しください。</p>
      ) : ranking.length === 0 ? (
        <p className="text-gray-400">まだランクインしているプレイヤーはいません</p>
      ) : null}

      {ranking !== null && (
        <ul className="space-y-2">
          {ranking.map((player) => (
            <li key={player.name} className="p-2 border rounded">
              {player.rank}位 - {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
