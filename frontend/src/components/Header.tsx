"use client";

import { useState } from "react";
import { DialogLogin } from "./DialogLogin";
import { DialogSignup } from "./DialogSignup";

const theme = {
  bg: "#000000",
  surface: "#121212",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#B3B3B3",
  accent: "#1DB954",
};

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header
        style={{
          width: "100%",
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          <div
            style={{
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: "-0.5px",
              color: theme.text,
            }}
          >
            PlaylistDiscovery
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            <button
              onClick={() => setLoginOpen(true)}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                color: theme.muted,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = theme.text)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = theme.muted)
              }
            >
              Login
            </button>

            <button
              onClick={() => setRegisterOpen(true)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 999,
                background: theme.text,
                color: "#000",
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
              Registro
            </button>

          </div>

        </div>
      </header>

      <DialogLogin open={loginOpen} onOpenChange={setLoginOpen} />
      <DialogSignup open={registerOpen} onOpenChange={setRegisterOpen} />
    </>
  );
}