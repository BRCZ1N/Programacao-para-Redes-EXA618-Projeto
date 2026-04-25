"use client";

import * as React from "react";
import { Library, Gamepad2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
import type { UserPerfil } from "../models/User";

const data = {
  navMain: [
    {
      title: "Biblioteca",
      icon: Library,
      url: "/dashboard/playlists",
    },
    {
      title: "Games",
      icon: Gamepad2,
      url: "/dashboard/games",
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
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
        setUser(await response.json());
      }
    } catch (error) {
      console.log("Erro:", error);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-slate-950 border-r border-slate-800/70"
      {...props}
    >
      {/* HEADER */}
      <SidebarHeader
        className="
    border-b border-slate-800/70
    bg-slate-900/30
    py-5

    transition-colors
    hover:bg-white/5
  "
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center gap-3">
                {/* LOGO */}
                <div
                  className="
              flex aspect-square size-9 items-center justify-center
              rounded-xl bg-blue-600 text-white font-black
              shadow-md shadow-blue-500/20
              shrink-0
              transition-none
            "
                >
                  PD
                </div>

                {/* TEXTO */}
                <div className="flex flex-col group-data-[state=collapsed]:hidden">
                  <span className="font-bold text-white">
                    PlaylistDiscovery
                  </span>
                  <span className="text-xs text-slate-400">Game Library</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* CONTENT */}
      <SidebarContent className="py-4 bg-slate-950">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {data.navMain.map((item) => {
              const isActive = location.pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => navigate(item.url)}
                    className="
                      flex items-center gap-3 px-3 py-2 rounded-xl
                      text-slate-400
                      transition-none

                      data-[active=true]:bg-blue-600/20
                      data-[active=true]:text-white
                      data-[active=true]:border
                      data-[active=true]:border-blue-500/40

                      group-data-[state=collapsed]:justify-center
                    "
                  >
                    <item.icon className="w-5 h-5 shrink-0 text-slate-400" />

                    <span className="font-medium group-data-[state=collapsed]:hidden">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter
        className="
    border-t border-slate-800/70
    bg-slate-900/30
    p-3

    transition-colors
    hover:bg-white/5
  "
      >
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
