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
        <header className="flex h-16 items-center px-4">
          {/* Esse botão SÓ vai aparecer/funcionar direito se estiver aqui */}
          <SidebarTrigger />
        </header>
        <main>
          {/* Seu conteúdo */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
