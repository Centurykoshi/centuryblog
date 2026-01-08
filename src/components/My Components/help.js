"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// ...existing imports...

export default function SidebarDashboard() {
    const [isOpen, setIsOpen] = useState(true);
    const [isNewPostOpen, setIsNewPostOpen] = useState<string>("");

    const sidebars = [
        { name: "New Post", icon: Edit },
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Notification", icon: Bell }
    ]

    const subSidebar = [
        { name: "All Posts", icon: AlignLeftIcon, href: "/dashboard/posts" },
        { name: "Drafts", icon: FileText, href: "/dashboard/drafts" },
        { name: "Published", icon: Archive, href: "/dashboard/published" },
        { name: "Scheduled", icon: Clock, href: "/dashboard/scheduled" },
    ]
    
    return (
        <div className="overflow-x-hidden">
            <div className=" ">
                <Sidebar>
                    <SidebarContent className="bg-secondary/10">
                        {/* ...existing collapsible code... */}
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
                                <SidebarMenu className="ml-4">
                                    {subSidebar.map((sidebar, index) => (
                                        <SidebarMenuItem key={sidebar.name}>
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    duration: 0.2,
                                                    ease: "easeOut"
                                                }}
                                            >
                                                <SidebarMenuButton asChild>
                                                    <Link href={sidebar.href}>
                                                        <motion.div
                                                            className="flex items-center cursor-pointer text-xs text-secondary-foreground p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200 w-full"
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
                                                    </Link>
                                                </SidebarMenuButton>
                                            </motion.div>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </motion.div>
                        </CollapsibleContent>
                        {/* ...rest of code... */}
                    </SidebarContent>
                </Sidebar>
            </div>
        </div>
    )
}