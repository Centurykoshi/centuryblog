import { AppHeader } from "@/components/My Components/Dashboard/AppHeader"
import SidebarDashboard from "@/components/My Components/Dashboard/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <main>
        <SidebarTrigger />
        <div className="z-10">
          <AppHeader />
        </div>

        <SidebarDashboard />


        {children}
      </main>
    </SidebarProvider>
  )
}