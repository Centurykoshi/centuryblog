"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarContent, Sidebar, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { AlignCenterHorizontal, BedIcon, Bell, Edit, Icon, LayoutDashboard, Mail, ChevronDown, FileText, Clock, Archive, AlignLeftIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

export default function SidebarDashboard() {

    const sidebars = [
        { name: "New Post", icon: Edit },
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Notification", icon: Bell }
    ]

    const subSidebar = [
        { name: "All Posts", icon: AlignLeftIcon },
        { name: "Drafts", icon: FileText },
        { name: "Published", icon: Archive },
        { name: "Scheduled", icon: Clock },
    ]
    return (
        <Sidebar>
            <SidebarContent className="bg-secondary/10">
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <motion.div
                                        className="flex items-center justify-between text-sm cursor-pointer text-secondary-foreground p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                        variants={{
                                            hover: {
                                                x: 4,
                                            }
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center">
                                            <motion.div
                                                className="mr-3"
                                                variants={{
                                                    hover: {
                                                        rotate: 360
                                                    }
                                                }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <AlignCenterHorizontal className="h-4 w-4" />
                                            </motion.div>
                                            <span>Posts</span>
                                        </div>

                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                    </motion.div>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    {subSidebar.map((sidebar) => (
                                        <SidebarMenuItem key={sidebar.name}>
                                            <SidebarMenuButton asChild>
                                                <motion.div className="flex items-center cursor-pointer text-xs text-secondary-foreground p-2
                                                rounded-lg hover:bg-accent/50 transition-colors duration-200 pl-8"
                                                    whileHover="hover"
                                                    whileTap={{ scale: 0.8 }}
                                                    variants={{
                                                        hover: {
                                                            x: 4,
                                                        }
                                                    }}
                                                    transition={{ duration: 0.2 }}>
                                                    <motion.div
                                                        className="mr-3"
                                                        variants={{
                                                            hover: {
                                                                rotate: 360
                                                            }
                                                        }}
                                                        transition={{ duration: 0.6 }}
                                                    >
                                                        <sidebar.icon className="h-3 w-3" />


                                                    </motion.div>
                                                    {sidebar.name}
                                                </motion.div>
                                            </SidebarMenuButton>

                                        </SidebarMenuItem>
                                    ))}

                                </CollapsibleContent>
                            </SidebarMenuItem>

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
                </Collapsible>
            </SidebarContent>
        </Sidebar >
    )
}