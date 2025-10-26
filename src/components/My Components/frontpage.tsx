"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Search, XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";

export default function Frontpage() {

    const [activeLink, setActiveLink] = useState<string | null>(null);

    const [searchOpen, setSearchOpen] = useState(false);


    const links = [
        { name: "Projects", href: "/projects" },
        { name: "Art", href: "/art" },
        { name: "About Me", href: "/aboutme" }
    ]




    return (
        <>
            <div className="flex justify-start  p-4">
                <div className="max-w-5xl w-full justify-between flex">

                    <div className="max-w-md w-full justify-between flex relative left-[25%]">
                        <Link href="/" onClick={() => setActiveLink("Piyush Yadav")} className={cn(
                            "text-lg hover:text-secondary-foreground", activeLink === "Piyush Yadav" ? "text-color-primary" : "text-primary"
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
            {searchOpen && (
                <div className={`fixed flex top-0 h-[60vh] bg-transparent border-none shadow-none w-full pointer-events-auto transition-all duration-300 ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}>


                    <Image src="/waves1.png" alt="Search" className="w-full" width={1920} height={1080} />

                    <div className="absolute inset-0 flex  flex-col items-center w-full p-4">
                        <div className="relative ">
                            <Search className="absolute left-0 top-1/2 ml-2 pl-1 transform -translate-y-1/2 h-5 w-5 text-primary-foreground pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Searching something "
                                className="px-4 py-2 p-2 w-160 pl-10 border-0 border-b-2
                                border-gray-800 focus:border-primary focus:outline-none transition placeholder-gray-400 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-none" />


                        </div>

                        <div className="absolute top-4 right-5 ">
                            <XIcon className="w-6 h-6 cursor-pointer hover:animate-spin transition duration-200 mt-4 "
                                onClick={() => setSearchOpen(false)} />

                        </div>


                        <div className="italic max-w-xl  text-center mt-2 p-1">
                            Search through all of the blog posts and snippets on my site. This Project is in beta . If you run into any bugs, <Link href={"/Contact"} className="underline"> please let me know!</Link>

                        </div>
                    </div>
                </div>


            )}

        </>
    )
}