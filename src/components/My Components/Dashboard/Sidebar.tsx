"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarContent, Sidebar, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { AlignCenterHorizontal, BedIcon, Bell, Edit, Icon, LayoutDashboard, Mail, ChevronDown, FileText, Clock, Archive, AlignLeftIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import NewPostButton from "./NewPostButton";

export default function SidebarDashboard() {
    const [isOpen, setIsOpen] = useState(true);

    const [isNewPostOpen, setIsNewPostOpen] = useState<string>("");

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
        <div className="overflow-x-hidden">
            <div className=" ">
                <Sidebar>
                    <SidebarContent className="bg-secondary/10">
                        <Collapsible
                            open={isOpen}
                            onOpenChange={setIsOpen}
                            className="group/collapsible"
                        >
                            <SidebarGroup>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <motion.div
                                            animate={{ opacity: 1 }}
                                            initial={{ opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <motion.div
                                                    className="flex items-center justify-between text-sm cursor-pointer text-secondary-foreground p-2 rounded-lg hover:text-foreground hover:bg-accent/50 transition-colors duration-200"
                                                    whileHover="hover"
                                                    whileTap={{ scale: 0.98 }}
                                                    variants={{
                                                        hover: {
                                                            x: 4,
                                                        }
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="flex items-center ">
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
                                                        <span className="">Posts</span>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </motion.div>
                                                </motion.div>
                                            </CollapsibleTrigger>
                                        </motion.div>

                                        <CollapsibleContent asChild>
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: "easeInOut",
                                                    staggerChildren: 0.1
                                                }}
                                                className="overflow-hidden"
                                            >
                                                {subSidebar.map((sidebar, index) => (
                                                    <motion.div
                                                        key={sidebar.name}
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{
                                                            delay: index * 0.1,
                                                            duration: 0.2,
                                                            ease: "easeOut"
                                                        }}
                                                    >
                                                        <SidebarMenuItem>
                                                            <SidebarMenuButton asChild>
                                                                <motion.div
                                                                    className="flex items-center cursor-pointer text-xs text-secondary-foreground p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 pl-8"
                                                                    whileHover="hover"
                                                                    whileTap={{ scale: 0.95 }}
                                                                    variants={{
                                                                        hover: {
                                                                            x: 6,
                                                                            backgroundColor: "rgba(var(--accent))",
                                                                        }
                                                                    }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <motion.div
                                                                        className="mr-3"
                                                                        variants={{
                                                                            hover: {
                                                                                rotate: 360,
                                                                                scale: 1.1
                                                                            }
                                                                        }}
                                                                        transition={{ duration: 0.6 }}
                                                                    >
                                                                        <sidebar.icon className="h-3 w-3" />
                                                                    </motion.div>
                                                                    <motion.span
                                                                        variants={{
                                                                            hover: {
                                                                                scale: 1.05
                                                                            }
                                                                        }}
                                                                    >
                                                                        {sidebar.name}
                                                                    </motion.span>
                                                                </motion.div>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>

                                    {sidebars.map((sidebar) => (
                                        <SidebarMenuItem key={sidebar.name} onClick={() => setIsNewPostOpen(sidebar.name)}>
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
            </div>
            <div className="">
                {isNewPostOpen === "New Post" && (
                    <NewPostButton />
                )}
            </div>
        </div>
    )
}