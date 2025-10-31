"use client";

import { Button } from "@/components/ui/button";
import { SidebarContent, Sidebar, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Bell, Edit, Icon, LayoutDashboard, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SidebarDashboard() {

    const sidebars = [
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
                                    <motion.div
                                        className="flex items-center cursor-pointer text-secondary-foreground p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                        variants={{
                                            hover: {
                                                x: 4,
                                            }
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.div
                                            className="mr-3"
                                            variants={{
                                                hover: {
                                                    rotate: 360
                                                }
                                            }}
                                            transition={{ duration: 0.6 }}
                                        >
                                          
                                            <sidebar.icon className="h-4 w-4" />
                                        </motion.div>
                                        
                                        <span>{sidebar.name}</span>
                                    </motion.div>
                                </SidebarMenuButton>

                            </SidebarMenuItem>

                        ))}
                    </SidebarMenu>

                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}