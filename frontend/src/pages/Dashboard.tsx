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

export function Dashboard() {
  const location = useLocation();
  const routeLabels: Record<string, string> = {
    "/dashboard/games": "Games",
    "/dashboard/playlists": "Biblioteca",
  };

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b border-slate-800 bg-slate-950 px-6 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger className="self-center text-slate-400 hover:text-white hover:bg-slate-800" />

            <Separator
              orientation="vertical"
              className="self-center bg-slate-800 h-6"
            />

            <Breadcrumb className="self-center">
              <BreadcrumbList>
                <BreadcrumbItem className="text-sm font-semibold text-white">
                  {routeLabels[location.pathname] ?? "Dashboard"}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex-1 bg-slate-950 min-h-screen">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
