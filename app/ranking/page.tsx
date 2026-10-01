export default async function RankingPage() {
  type RankingPlayer = { name: string; rank: number };

  
  const res = await fetch("http://localhost:3001/api/ranking");

  const ranking = (await res.json()) as RankingPlayer[];

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-bold mb-4">Ranking</h1>

      {ranking.length === 0 && (
        <p className="text-gray-400">まだランクインしているプレイヤーはいません</p>
      )}

      <ul className="space-y-2">
        {ranking.map((player) => (
          <li key={player.name} className="p-2 border rounded">
            {player.rank}位 - {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

