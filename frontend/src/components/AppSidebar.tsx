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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={location.pathname === item.url}
                  onClick={() => navigate(item.url)}
                  className="gap-3"
                >
                  <item.icon className="shrink-0" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
