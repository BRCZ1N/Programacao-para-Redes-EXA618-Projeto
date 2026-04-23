import { AppSidebar } from "../components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { apiFetch } from "../fetcher/Fetcher";
import { PlaylistDrawer } from "../components/PlaylistDrawer";
import type { Playlist } from "../models/Playlist";
import { ListPlus } from "lucide-react";

export function Dashboard() {
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [open, setOpen] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist>();
  const isPlaylistsPage = location.pathname === "/dashboard/playlists";
  const routeLabels: Record<string, string> = {
    "/dashboard/games": "Games",
    "/dashboard/playlists": "Playlists",
  };

  async function handleGeneratePlaylist() {
    try {
      setIsGenerating(true);

      const response = await apiFetch("http://localhost:8000/api/playlist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "auto",
        }),
      });
      if (!response.ok) return;

      const data = await response.json();

      setPlaylist(data);
      setOpen(true);
    } catch (error) {
      console.log("Erro na requisição:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 shadow-sm px-4">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="self-center" />

            <Separator orientation="vertical" className="self-center" />

            <Breadcrumb className="self-center">
              <BreadcrumbList>
                <BreadcrumbItem>
                  {routeLabels[location.pathname] ?? "Dashboard"}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {isPlaylistsPage && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleGeneratePlaylist}
                disabled={isGenerating}
              >
                <ListPlus />
                Playlist
                {isGenerating && <Spinner data-icon="inline-start" />}
              </Button>
            </div>
          )}

          <PlaylistDrawer
            open={open}
            onOpenChange={setOpen}
            playlist={playlist}
            onGenerateAgain={handleGeneratePlaylist}
          />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
