import { AppSidebar } from "../components/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb"
import { Separator } from "../components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar"

export function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Este Header é o que "prende" o botão no topo no mobile */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
        </header>

        <main className="p-4">
          {/* Seu conteúdo aqui */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
