"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Search, XIcon, Menu } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Blogging from "./Blogging";


export default function Header() {

    const [activeLink, setActiveLink] = useState < string | null > (null);
    const [searchOpen, setSearchOpen] = useState(false);

    const links = [
        { name: "Projects", href: "/projects" },
        { name: "Art", href: "/art" },
        { name: "About Me", href: "/aboutme" }
    ]

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* Logo */}
                        <Link
                            href="/"
                            onClick={() => setActiveLink("Piyush Yadav")}
                            className="group"
                        >
                            <motion.div
                                className="text-xl font-bold tracking-tight"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    Piyush Yadav
                                </span>
                                <motion.div
                                    className="h-0.5 bg-gradient-to-r from-primary to-transparent"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setActiveLink(link.name)}
                                    className="relative group"
                                >
                                    <motion.span
                                        className={cn(
                                            "text-sm font-medium transition-colors",
                                            activeLink === link.name
                                                ? "text-primary"
                                                : "text-secondary-foreground/70 hover:text-secondary-foreground"
                                        )}
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {link.name}
                                    </motion.span>

                                    {/* Active indicator */}
                                    {activeLink === link.name && (
                                        <motion.div
                                            layoutId="activeLink"
                                            className="absolute -bottom-[1.5rem] left-0 right-0 h-0.5 bg-primary"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}

                                    {/* Hover underline */}
                                    <motion.div
                                        className="absolute -bottom-[1.5rem] left-0 h-0.5 bg-primary/40"
                                        initial={{ width: 0 }}
                                        whileHover={{ width: "100%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* Search Button */}
                        <motion.button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-secondary/50 hover:bg-secondary transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search className="w-4 h-4 text-secondary-foreground" />
                            <span className="hidden sm:inline text-sm text-secondary-foreground/70">Search...</span>
                            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-primary/20 bg-background px-1.5 text-[10px] font-medium text-secondary-foreground/70">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </motion.button>

                    </div>
                </div>
            </motion.header>

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
                            onClick={() => setSearchOpen(false)}
                        />

                        {/* Search Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                        >
                            <div className="bg-secondary/95 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-2xl overflow-hidden">

                                {/* Search Input */}
                                <div className="relative p-6 pb-4">
                                    <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-foreground/50" />
                                    <Input
                                        type="text"
                                        placeholder="Search through all blog posts and snippets..."
                                        autoFocus
                                        className="w-full pl-12 pr-12 py-6 text-lg bg-transparent border-0 border-b-2 border-primary/20 focus:border-primary rounded-none shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-secondary-foreground placeholder:text-secondary-foreground/50"
                                    />

                                    {/* Close button */}
                                    <motion.button
                                        onClick={() => setSearchOpen(false)}
                                        className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-primary/10 transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <XIcon className="w-5 h-5 text-secondary-foreground/70" />
                                    </motion.button>
                                </div>

                                {/* Info Text */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="px-6 pb-6 text-sm text-secondary-foreground/70 text-center"
                                >
                                    Search through all of the blog posts and snippets on my site. This project is in beta. If you run into any bugs,{" "}
                                    <Link
                                        href="/Contact"
                                        className="text-primary hover:underline font-medium"
                                        onClick={() => setSearchOpen(false)}
                                    >
                                        please let me know!
                                    </Link>
                                </motion.div>

                                {/* Quick Actions */}
                                <div className="border-t border-primary/10 p-4 bg-background/50">
                                    <div className="flex items-center justify-between text-xs text-secondary-foreground/50">
                                        <div className="flex gap-4">
                                            <span className="flex items-center gap-1">
                                                <kbd className="px-2 py-1 rounded bg-secondary border border-primary/20">↑</kbd>
                                                <kbd className="px-2 py-1 rounded bg-secondary border border-primary/20">↓</kbd>
                                                to navigate
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <kbd className="px-2 py-1 rounded bg-secondary border border-primary/20">↵</kbd>
                                                to select
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-2 py-1 rounded bg-secondary border border-primary/20">esc</kbd>
                                            to close
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}