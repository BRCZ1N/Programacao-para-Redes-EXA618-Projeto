import { useNavigate } from "react-router-dom";
import { GameCarousel } from "../components/GameCarousel";
import { Header } from "../components/Header";
import { Flame, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { useAuth } from "../utils/AuthProvider";
import { useState } from "react";
import { DialogLogin } from "../components/DialogLogin";

const theme = {
  bg: "#000000",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  surface: "#121212",
  accent: "#1DB954",
};

export function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [loginOpen, setLoginOpen] = useState(false);

  const isLogged = !!user;

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
              color: "#fff",
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
            disabled={loading}
            onClick={() => {
              if (loading) return;

              if (!isLogged) {
                setLoginOpen(true);
                return;
              }

              navigate("/dashboard/games");
            }}
            style={{
              width: 220,
              padding: "12px 16px",
              borderRadius: 999,
              background: isLogged ? theme.accent : theme.text,
              color: "#000",
              fontWeight: 700,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {isLogged ? "Ir para dashboard" : "Começar agora"}
          </button>

          
          {isLogged && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                borderRadius: 10,
                background: theme.surface,
                border: "1px solid #2A2A2A",
                color: theme.muted,
                fontSize: 14,
              }}
            >
              Bem-vindo de volta,{" "}
              <strong style={{ color: "#fff" }}>
                {user?.first_name || user?.username}
              </strong>{" "}
              
            </div>
          )}
        </div>
      </section>

      <div style={{ color: "#fff" }}>
        <Section
          icon={<TrendingUp size={18} color="#ff7a00" />}
          title="Jogos em alta"
          subtitle="Os jogos encontrados mais populares"
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
          subtitle="Os melhores jogos encontrados "
        >
          <GameCarousel title="" type="top" />
        </Section>
      </div>

      <DialogLogin
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onGoToSignup={() => {
          setLoginOpen(false);
        }}
      />
    </main>
  );
}

function Section({ icon, title, subtitle, children }) {
  return (
    <section style={{ padding: "40px 24px" }}>
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
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {title}
            </h2>
          </div>

          <p style={{ fontSize: 13, color: "#B3B3B3" }}>
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}