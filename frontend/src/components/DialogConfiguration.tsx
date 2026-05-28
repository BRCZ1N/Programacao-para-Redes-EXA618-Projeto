"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

import type { UserPerfil } from "../models/User";
import { UserRound} from "lucide-react";
import { PerfilData } from "./PerfilData";

type Tab = "account" | "security";

const theme = {
  bg: "#000000",
  surface: "#121212",
  border: "#2A2A2A",
  text: "#FFFFFF",
  muted: "#A1A1A1",
};

export function DialogConfiguration({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<Tab>("account");
  const [, setUser] = useState<UserPerfil>();

  async function loadUser() {
    try {
      let response = await fetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me/", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "https://programacao-para-redes-exa618-projeto.onrender.com/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshResponse.ok) {
          response = await fetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/user/me/", {
            method: "GET",
            credentials: "include",
          });
        }
      }

      if (response.ok) {
        const user = await response.json();
        setUser(user);
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const tabButton = (key: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(key)}
      style={{
        cursor: "pointer",
        background: tab === key ? "rgba(255,255,255,0.1)" : "transparent",
        color: tab === key ? "#fff" : theme.muted,
        border: tab === key ? `1px solid #444` : "1px solid transparent",
        padding: "6px 12px",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        transition: "all 150ms ease",
        fontWeight: tab === key ? 500 : 400,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "92%",
          maxWidth: "400px",
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "24px",
          color: theme.text,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle className="sr-only">Configurações</DialogTitle>
        <DialogDescription className="sr-only">
          Painel de configuração do usuário
        </DialogDescription>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${theme.border}`,
              overflowX: "auto",
            }}
          >
            {tabButton("account", "Conta", <UserRound size={16} />)}
          
          </div>

          <div
            style={{
              overflow: "y-auto",
              maxHeight: "55vh",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {tab === "account" && <PerfilData />}
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}