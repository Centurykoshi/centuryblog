"use client";

import { AppSidebar } from "@/components/My Components/Dashboard/AppHeader"
import Dashboard from "@/components/My Components/Dashboard/Dashboar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                <Dashboard />

                {children}
            </main>
        </SidebarProvider>
    )
}