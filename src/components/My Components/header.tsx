"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Search, XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Blogging from "./Blogging";


export default function Header() {

    const [activeLink, setActiveLink] = useState<string | null>(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const links = [
        { name: "Projects", href: "/projects" },
        { name: "Art", href: "/art" },
        { name: "About Me", href: "/aboutme" }
    ]




    return (

        <>
            <div className="flex justify-start flex-col p-4 sticky top-0 z-50 bg-background/80 backdrop-blur-2xl">
                <div className="max-w-6xl w-full justify-between flex">

                    <div className="max-w-xl w-full justify-between flex relative left-[25%]">
                        <Link href="/" onClick={() => setActiveLink("Piyush Yadav")} className={cn(
                            "text-xl font-semibold italic hover:text-secondary-foreground", activeLink === "Piyush Yadav" ? "text-color-primary" : "text-primary"
                        )}>
                            <div className="text-xl cursor-pointer ">
                                Piyush Yadav

                            </div>
                        </Link>
                        <div className="flex gap-6 ">
                            {links.map(link => (
                                <Link key={link.name} href={link.href} onClick={() => setActiveLink(link.name)}
                                    className={cn(
                                        "text-lg hover:text-secondary-foreground", activeLink === link.name ? "text-primary" : "text"
                                    )}>
                                    {link.name}

                                </Link>
                            ))}



                        </div>

                    </div>

                    <div className="flex gap-4 mt-1 justify-end">

                        <Search className="w-5 h-5 cursor-pointer hover:animate-bounce transition duration-200"
                            onClick={() => setSearchOpen(true)} />

                    </div>
                </div>
            </div>




            <AnimatePresence>
                {searchOpen && (
                    <motion.div initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute flex top-0 h-[60vh] bg-transparent border-none shadow-none w-full `}>


                        <Image src="/waves1.png" alt="Search" className="w-full" width={1920} height={1080} />

                        <div className="absolute inset-0 flex  flex-col items-center w-full p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="relative"
                            >
                                <Search className="absolute left-0 top-1/2 ml-2 pl-1 transform -translate-y-1/2 h-5 w-5 text-primary-foreground pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="Searching something "
                                    className="px-4 py-2 p-2 w-160 pl-10 border-0 border-b-2
                                border-gray-800 focus:border-primary focus:outline-none transition placeholder-gray-400 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-none" />
                            </motion.div>




                            <button
                                className="absolute top-4 right-5 hover:opacity-70 transition duration-200"
                                onClick={() => setSearchOpen(false)}
                            >
                                <XIcon className="w-6 h-6 cursor-pointer" />
                            </button>

                            <motion.div initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }} className="italic max-w-xl  text-center mt-2 p-1">
                                Search through all of the blog posts and snippets on my site. This Project is in beta . If you run into any bugs, <Link href={"/Contact"} className="underline"> please let me know!</Link>

                            </motion.div>
                        </div>

                    </motion.div >


                )
                }
            </AnimatePresence>
        </>
    )


}