import { GameCarousel } from "../components/GameCarousel";
import { Header } from "../components/Header";
import { Flame, Sparkles, Trophy } from "lucide-react";

export function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      
      <section className="px-8 py-16">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
              Monte suas playlists com os melhores jogos
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Explore jogos em alta, lançamentos e os mais bem avaliados para
              adicionar às suas playlists personalizadas. Descubra novos títulos e
              organize sua biblioteca do seu jeito.
            </p>
          </div>

          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300">
            Começar agora
          </button>
        </div>
      </section>

      <section className="px-8 py-12 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Jogos em alta</h2>
          </div>
          <p className="text-slate-500 text-sm">Os jogos mais populares agora</p>
        </div>
        <GameCarousel title="" type="trending" />
      </section>

      <section className="px-8 py-12 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Lançamentos recentes</h2>
          </div>
          <p className="text-slate-500 text-sm">Novos jogos lançados recentemente</p>
        </div>
        <GameCarousel title="" type="new" />
      </section>

      <section className="px-8 py-12 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Mais bem avaliados</h2>
          </div>
          <p className="text-slate-500 text-sm">Os melhores jogos de todos os tempos</p>
        </div>
        <GameCarousel title="" type="top" />
      </section>
    </main>
  );
}