"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function Frontpage() {
    const [activeLink, setActiveLink] = useState < string | null > (null);
    const [searchOpen, setSearchOpen] = useState(false);

    const links = [
        { name: "Projects", href: "/projects" },
        { name: "Art", href: "/art" },
        { name: "About Me", href: "/aboutme" }
    ]

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-start p-4"
            >
                <div className="max-w-5xl w-full justify-between flex">
                    <div className="max-w-md w-full justify-between flex relative left-[25%]">
                        <Link
                            href="/"
                            onClick={() => setActiveLink("Piyush Yadav")}
                            className="group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "text-xl cursor-pointer transition-all duration-300",
                                    activeLink === "Piyush Yadav"
                                        ? "text-primary"
                                        : "text-primary group-hover:text-pink-500"
                                )}
                            >
                                Piyush Yadav
                                <motion.div
                                    className="h-0.5 bg-pink-500 mt-1"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        </Link>

                        <div className="flex gap-6">
                            {links.map((link, index) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setActiveLink(link.name)}
                                    className="group relative"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "text-lg transition-colors duration-300",
                                            activeLink === link.name
                                                ? "text-primary font-semibold"
                                                : "text-foreground/70 group-hover:text-primary"
                                        )}
                                    >
                                        {link.name}
                                        <motion.div
                                            className="h-0.5 bg-primary mt-1"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: activeLink === link.name ? "100%" : 0
                                            }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-1 justify-end">
                        <motion.div
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Search
                                className="w-5 h-5 cursor-pointer text-foreground/70 hover:text-primary transition-colors duration-300"
                                onClick={() => setSearchOpen(true)}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setSearchOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.95 }}
                            transition={{ duration: 0.4, type: "spring", damping: 25 }}
                            className="fixed flex top-0 h-[60vh] bg-transparent border-none shadow-none w-full z-50"
                        >
                            <Image
                                src="/waves1.png"
                                alt="Search"
                                className="w-full object-cover"
                                width={1920}
                                height={1080}
                            />

                            <div className="absolute inset-0 flex flex-col items-center w-full p-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                    className="relative"
                                >
                                    <Search className="absolute left-0 top-1/2 ml-2 pl-1 transform -translate-y-1/2 h-5 w-5 text-primary-foreground pointer-events-none" />
                                    <Input
                                        type="text"
                                        placeholder="Searching something"
                                        className="px-4 py-2 p-2 w-160 pl-10 border-0 border-b-2
                                        border-gray-800 focus:border-primary focus:outline-none transition-all duration-300 placeholder-gray-400 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-none"
                                        autoFocus
                                    />
                                </motion.div>

                                <div className="absolute top-4 right-5">
                                    <motion.div
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <X
                                            className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors duration-200 mt-4"
                                            onClick={() => setSearchOpen(false)}
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="italic max-w-xl text-center mt-2 p-1"
                                >
                                    Search through all of the blog posts and snippets on my site. This Project is in beta. If you run into any bugs, <Link href={"/Contact"} className="underline hover:text-pink-500 transition-colors duration-300">please let me know!</Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}