import { AppSidebar } from "../components/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "../components/ui/breadcrumb"
import { Separator } from "../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar"
import { Outlet, useLocation } from "react-router-dom"

const routeLabels: Record<string, string> = {
  "/dashboard/games": "Games",
  "/dashboard/playlists": "Playlists",
}

export function Dashboard() {

  const location = useLocation()

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 shadow-sm px-4">
          <div className="flex items-center gap-2">
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
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}