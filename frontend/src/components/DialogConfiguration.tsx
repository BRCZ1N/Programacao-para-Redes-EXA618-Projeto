"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

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
  const [, setUser] = useState<UserPerfil>();

  async function loadUser() {
    try {
      let response = await fetch("http://127.0.0.1:8000/api/user/me/", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(
          "http://127.0.0.1:8000/api/auth/refresh/",
          {
            method: "POST",
            credentials: "include",
          },
        );

        if (refreshResponse.ok) {
          response = await fetch("http://127.0.0.1:8000/api/user/me/", {
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
        padding: "10px 12px",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        transition: "all 150ms ease",
        width: "100%",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
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
      <DialogContent
            className="
                      w-[95vw] sm:max-w-3xl 
                      p-0 overflow-hidden 
                      max-h-[90vh] sm:max-h-[85vh]
                      bg-[#0A0A0A] border border-[#2A2A2A]

                      pt-10 sm:pt-0

                      [&>button]:text-white 
                      [&>button]:hover:bg-[#1A1A1A]
                      [&>button]:border-[#2A2A2A]
                      [&>button]:rounded-md
                      "
      >
        <DialogTitle className="sr-only">Configurações</DialogTitle>
        <DialogDescription className="sr-only">
          Painel de configuração do usuário
        </DialogDescription>

        <div className="flex flex-col sm:flex-row h-full">

          <div
            className="
              w-full sm:w-56 
              flex sm:flex-col 
              flex-row 
              gap-2 
              p-3 
              border-b sm:border-b-0 sm:border-r 
              border-[#2A2A2A] 
              bg-[#0A0A0A]
              overflow-x-auto sm:overflow-visible
            "
          >
            {menuButton("account", "Conta")}
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4 text-white">
              {tab === "account" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold">Conta</h2>
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