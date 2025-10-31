"use Client";

import { Button } from "@/components/ui/button";
import { SidebarContent, Sidebar, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Bell, Edit, Icon, LayoutDashboard, Mail } from "lucide-react"

export default function SidebarDashboard() {

    const sidebars = [
        { name: "Posts", icon: Mail },
        { name: "New Post", icon: Edit },
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Notification", icon: Bell }
    ]

    const subSidebar = [
        { name: "Drafts", icon: Icon },
        { name: "Published", icon: Icon },
        { name: "Schedule", icon: Icon },
    ]
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {sidebars.map((sidebar) => (
                            <SidebarMenuItem key={sidebar.name}>
                                <SidebarMenuButton asChild>
                                    <Button>
                                        <sidebar.icon className="mr-2 h-4 w-4" />
                                        {sidebar.name}
                                    </Button>
                                </SidebarMenuButton>

                            </SidebarMenuItem>

                        ))}
                    </SidebarMenu>

                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}