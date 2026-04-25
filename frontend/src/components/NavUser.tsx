"use client";

import { Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

import { useNavigate } from "react-router-dom";
import type { UserPerfil } from "../models/User";
import { DialogConfiguration } from "./ConfigurationDialog";
import { useState } from "react";

export function NavUser({ user }: { user: UserPerfil }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [openConfig, setOpenConfig] = useState(false);

  async function handleLogout() {
    try {
      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });

      navigate("/login");
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  }

  function handleConfiguration() {
    setOpenConfig(true);
  }

  const initials = user.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                md:h-8 md:p-0
                transition-none

                hover:bg-transparent !hover:bg-transparent
                hover:text-white !hover:text-white

                data-[state=open]:bg-transparent
              "
            >
              <Avatar className="h-8 w-8 rounded-lg overflow-hidden bg-transparent">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white">
                  {user.username}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="
              w-56 rounded-lg
              bg-slate-900 border-slate-800 text-slate-100
              shadow-none
            "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-3 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg overflow-hidden bg-transparent">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">
                    {user.username}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleConfiguration}
                className="
                  text-slate-300
                  bg-transparent
                  cursor-pointer

                  hover:bg-transparent !hover:bg-transparent
                  hover:text-slate-300 !hover:text-slate-300

                  focus:bg-transparent
                  focus:text-slate-300

                  data-[highlighted]:bg-transparent
                  data-[highlighted]:text-slate-300
                "
              >
                <Settings className="w-4 h-4" />
                Configurações
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="
                text-red-400
                bg-transparent
                cursor-pointer

                hover:bg-transparent !hover:bg-transparent
                hover:text-red-400 !hover:text-red-400

                focus:bg-transparent

                data-[highlighted]:bg-transparent
              "
            >
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <DialogConfiguration open={openConfig} onOpenChange={setOpenConfig} />
    </SidebarMenu>
  );
}