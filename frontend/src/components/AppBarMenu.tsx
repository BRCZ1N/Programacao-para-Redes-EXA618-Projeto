"use client";

import { Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const theme = {
  bg: "#000000",
  text: "#FFFFFF",
  muted: "#B3B3B3",
};

const pages = [
  { label: "Playlists", path: "/dashboard/playlists" },
  { label: "Games", path: "/dashboard/games" },
];

export function AppBarMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        height: 64,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: theme.bg,
        color: theme.text,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Menu size={18} color={theme.text} />
        </button>

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
              background: "transparent",
              border: "none",
              color: theme.muted,
              cursor: "pointer",
              fontSize: 14,
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.muted)}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <button
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <User size={18} color={theme.text} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "#000",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: 12,
          }}
        >
          {pages.map((page) => (
            <div
              key={page.path}
              onClick={() => {
                navigate(page.path);
                setOpen(false);
              }}
              style={{
                padding: 10,
                borderRadius: 6,
                cursor: "pointer",
                color: theme.text,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {page.label}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
