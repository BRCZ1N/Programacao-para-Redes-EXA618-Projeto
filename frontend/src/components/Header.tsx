"use client";

import { useState } from "react";
import { HomeIcon, Gamepad2 } from "lucide-react";
import {useNavigate } from "react-router-dom";
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

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const isLogged = !!user;

  return (
    <>
      <header
        style={{
          width: "100%",
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bg,
          color: theme.text,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBlock: "0.9rem",
            paddingInline: "clamp(16px, 3vw, 40px)",
            gap: "1rem",
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              cursor: "pointer",
              userSelect: "none",
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: 28,
                height: 28,
                objectFit: "contain",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: theme.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              PlaylistDiscovery
            </div>
          </div>

          {isLogged && (
            <nav
              className="hidden md:flex"
              style={{
                gap: "0.8rem",
                flex: 1,
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              {pages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.04)",
                    padding: "0.45rem 0.75rem",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: theme.muted,
                    cursor: "pointer",
                    fontSize: 14,
                    transition: "0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.text;
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.muted;
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.04)";
                  }}
                >
                  <span style={{ display: "flex" }}>{page.icon}</span>
                </button>
              ))}
            </nav>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            {!isLogged ? (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    fontSize: 13,
                    color: theme.muted,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Login
                </button>

                <button
                  onClick={() => setSignupOpen(true)}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 999,
                    background: theme.text,
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Registro
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                  }}
                >
                  {user?.username}
                </span>

                <UserDropdownMenu />
              </>
            )}
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