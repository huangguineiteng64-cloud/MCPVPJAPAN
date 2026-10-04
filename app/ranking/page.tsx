type RankingPlayer = { name: string; rank: number };

export const dynamic = "force-dynamic";

function isRankingPlayer(player: unknown): player is RankingPlayer {
  return (
    typeof player === "object" &&
    player !== null &&
    "name" in player &&
    typeof player.name === "string" &&
    "rank" in player &&
    typeof player.rank === "number"
  );
}

export default async function RankingPage() {
  let ranking: RankingPlayer[] | null;

  try {
    const res = await fetch("http://localhost:3001/api/ranking", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Ranking API returned HTTP ${res.status}`);
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data) || !data.every(isRankingPlayer)) {
      throw new Error("Ranking API returned invalid data");
    }

    ranking = data;
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
