"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import type { UserPerfil } from "../models/User";
import { UserRound } from "lucide-react";
import { PerfilData } from "./PerfilData";

type Tab = "account" | "profile" | "security" | "notifications" | "appearance";

export function DialogConfiguration({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<Tab>("account");
  const [user, setUser] = useState<UserPerfil>();

  async function loadUser() {
    try {
      let response = await fetch("http://localhost:8000/api/user/me/", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "http://localhost:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshResponse.ok) {
          response = await fetch("http://localhost:8000/api/user/me/", {
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

  const menuButton = (key: Tab, label: string) => (
    <button
      onClick={() => setTab(key)}
      style={{
        cursor: "pointer",
        background: tab === key ? "rgba(255,255,255,0.15)" : "transparent",
        color: tab === key ? "#fff" : "rgba(255,255,255,0.6)",
        border: tab === key ? "1px solid #444" : "1px solid transparent",
        padding: "8px 12px",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        transition: "all 150ms ease",
      }}
      onMouseEnter={(e) => {
        if (tab !== key) {
          e.currentTarget.style.background = "rgba(255,255,255,0.10)";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = "#333";
        }
      }}
      onMouseLeave={(e) => {
        if (tab !== key) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          e.currentTarget.style.borderColor = "transparent";
        }
      }}
    >
      <UserRound className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh] bg-[#0A0A0A] border border-[#2A2A2A] [&>button]:text-white [&>button]:hover:text-white [&>button]:hover:bg-[#1A1A1A] [&>button]:border-[#2A2A2A] [&>button]:rounded-md [&>button]:transition">
        <DialogTitle className="absolute w-0 h-0 overflow-hidden p-0 m-0">
          Configurações
        </DialogTitle>

        <DialogDescription className="absolute w-0 h-0 overflow-hidden p-0 m-0">
          Painel de configuração do usuário
        </DialogDescription>
        <div className="flex flex-col sm:flex-row h-full">
          <div className="sm:w-56 w-full p-3 flex flex-col gap-2 border-r border-[#2A2A2A] bg-[#0A0A0A]">
            <div className="flex flex-col gap-1">
              {menuButton("account", "Conta")}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden bg-[#0A0A0A]">
            <div className="h-full overflow-y-auto p-5 space-y-4 text-white">
              {tab === "account" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold">Conta</h2>
                  <p className="text-xs text-[#B3B3B3]">
                    Gerencie sua conta principal
                  </p>
                  <PerfilData />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
