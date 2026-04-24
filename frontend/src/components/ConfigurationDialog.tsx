import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import type { UserPerfil } from "../models/User";
import { UserRound } from "lucide-react";
import { PerfilData } from "./PerfilData";

type Tab = "account";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh]">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="sm:w-56 w-full p-3 flex flex-col gap-3 border-r shrink-0">
            {user && (
              <div className="flex items-center gap-2 px-2 py-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium truncate">
                  {user.username}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <button
                onClick={() => setTab("account")}
                className={`w-full px-3 py-2 rounded-md text-sm flex items-center gap-2 transition ${
                  tab === "account"
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/50"
                }`}
              >
                <UserRound className="h-4 w-4" />
                Conta
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto p-5 space-y-4">
              {tab === "account" && (
                <div className="space-y-3">
                  <h2 className="text-sm font-medium">Conta</h2>
                  <PerfilData/>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
