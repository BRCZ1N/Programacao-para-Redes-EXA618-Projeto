import { useNavigate } from "react-router-dom";
import { GameCarousel } from "../components/GameCarousel";
import { Header } from "../components/Header";
import { Sparkles, TrendingUp, Trophy } from "lucide-react";
import { useAuth } from "../utils/AuthProvider";
import { useState, type ReactNode } from "react";
import { DialogLogin } from "../components/DialogLogin";

const theme = {
  bg: "#000000",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  surface: "#121212",
  accent: "#1DB954",
};

type SectionProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
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
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        color: theme.text,
      }}
    >
      <Header />

  
      <section
        style={{
          padding: "clamp(40px, 6vw, 80px) 16px",
        }}
      >
        <div
          style={{
            maxWidth: "min(900px, 100%)",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            Monte suas playlists com os melhores jogos
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
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
            onClick={() => {
              if (loading) return;

              if (!isLogged) {
                setLoginOpen(true);
                return;
              }

              navigate("/dashboard");
            }}
            style={{
              width: "fit-content",
              minWidth: 180,
              padding: "12px 20px",
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
              </strong>
            </div>
          )}
        </div>
      </section>

   
      <div>
        <Section
          icon={<TrendingUp size={18} color="#ff7a00" />}
          title="Jogos em alta"
          subtitle="Os jogos mais populares"
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
          subtitle="Os melhores jogos"
        >
          <GameCarousel title="" type="top" />
        </Section>
      </div>

      <DialogLogin
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onGoToSignup={() => setLoginOpen(false)}
      />
    </main>
  );
}

function Section({ icon, title, subtitle, children }: SectionProps) {
  return (
    <section
      style={{
        padding: "clamp(24px, 4vw, 40px) 16px",
      }}
    >
      <div
        style={{
          maxWidth: "min(1100px, 100%)",
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
            textAlign: "center",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon}
            <h2
              style={{
                fontSize: "clamp(16px, 2.2vw, 18px)",
                fontWeight: 700,
              }}
            >
              {title}
            </h2>
          </div>

          <p style={{ fontSize: 13, color: "#B3B3B3" }}>{subtitle}</p>
        </div>

        {children}
      </div>
    </section>
  );
}