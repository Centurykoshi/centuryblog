import { AppSidebar } from "@/components/My Components/Dashboard/AppHeader"
import Dashboard from "@/components/My Components/Dashboard/Dashboar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="min-h-screen">
      <AppSidebar />
      <main className="min-h-screen w-full">
        <SidebarTrigger />
        <Dashboard />

        {children}
      </main>
    </SidebarProvider>
  )
}