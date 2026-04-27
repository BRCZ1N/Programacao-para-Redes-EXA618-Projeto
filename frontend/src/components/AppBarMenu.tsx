"use client";

import { useState } from "react";
import { HomeIcon, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../utils/AuthProvider";
import { UserDropdownMenu } from "../components/UserDropdownMenu";
import { DialogLogin } from "../components/DialogLogin";
import { DialogSignup } from "../components/DialogSignup";

const theme = {
  bg: "#000000",
  surface: "#121212",
  surfaceHover: "#1A1A1A",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  accent: "#1DB954",
};

const pages = [
  {
    path: "/",
    icon: <HomeIcon size={16} />,
  },
  {
    path: "/dashboard/games",
    icon: <Gamepad2 size={16} />,
  },
];

export function AppBarMenu() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header
        style={{
          height: 64,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bg,
          color: theme.text,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: 28,
                height: 28,
                objectFit: "contain",
              }}
            />

            <div
              style={{
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: theme.text,
              }}
            >
              PlaylistDiscovery
            </div>
          </div>
        </div>

        <nav className="hidden md:flex" style={{ gap: 16 }}>
          {pages.map((page) => (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.04)",
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.06)",
                color: theme.muted,
                cursor: "pointer",
                fontSize: 14,
                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.text;
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.muted;
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <span style={{ display: "flex" }}>{page.icon}</span>
            </button>
          ))}
        </nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
           
            <span
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {user?.first_name || user?.username || "Usuário"}
            </span>

          
            <UserDropdownMenu />
          </div>
        </div>
      </header>

      <DialogLogin
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onGoToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />

      <DialogSignup
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onGoToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}
