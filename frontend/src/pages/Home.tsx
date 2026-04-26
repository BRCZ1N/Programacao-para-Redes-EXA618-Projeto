import { GameCarousel } from "../components/GameCarousel";
import { Header } from "../components/Header";
import { Flame, Sparkles, Trophy } from "lucide-react";

const theme = {
  bg: "#000000",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  surface: "#121212",
  accent: "#1DB954",
};

export function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
      }}
    >
      <Header />


      <section
        style={{
          padding: "80px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            Monte suas playlists com os melhores jogos
          </h1>

          <p
            style={{
              fontSize: 16,
              color: theme.muted,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Explore jogos em alta, lançamentos e os mais bem avaliados para
            adicionar às suas playlists personalizadas. Descubra novos títulos e
            organize sua biblioteca do seu jeito.
          </p>

          <button
            style={{
              width: 180,
              padding: "12px 16px",
              borderRadius: 999,
              background: theme.text,
              color: "#000",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Começar agora
          </button>
        </div>
      </section>

      <Section
        icon={<Flame size={18} color="#ff7a00" />}
        title="Jogos em alta"
        subtitle="Os jogos mais populares agora"
      >
        <GameCarousel title="" type="trending" />
      </Section>

      <Section
        icon={<Sparkles size={18} color="#3B82F6" />}
        title="Lançamentos recentes"
        subtitle="Novos jogos lançados recentemente"
      >
        <GameCarousel title="" type="new" />
      </Section>

      <Section
        icon={<Trophy size={18} color="#FFD700" />}
        title="Mais bem avaliados"
        subtitle="Os melhores jogos de todos os tempos"
      >
        <GameCarousel title="" type="top" />
      </Section>
    </main>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon}
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
          </div>

          <p
            style={{
              fontSize: 13,
              color: "#B3B3B3",
            }}
          >
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}