import { GameCarousel } from "../components/GameCarousel";
import { Header } from "../components/Header";
export function Home() {
  return (
    <main className="space-y-10 p-6">
      <Header />
      <GameCarousel title="Trending" type="trending" />
      <GameCarousel title="Novos jogos" type="new" />
      <GameCarousel title="Mais bem avaliados" type="top" />
    </main>
  );
}
