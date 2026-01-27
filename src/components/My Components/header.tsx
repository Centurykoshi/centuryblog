"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Search, XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Blogging from "./Blogging";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { createServerSearchParamsForMetadata } from "next/dist/server/request/search-params";
import { Card, CardContent } from "../ui/card";
import { ModeToggle } from "./Dashboard/Customtheme";


export default function Header() {

    const [activeLink, setActiveLink] = useState<string | "Cenno">("Cenno");

    const [searchOpen, setSearchOpen] = useState(false);
    const links = [
        { name: "Projects", href: "/projects" },
        { name: "Art", href: "/art" },
        { name: "About Me", href: "/aboutme" }
    ]

    const trpc = useTRPC();

    const [text, SetText] = useState<string>("");
    const [debouncetext, setdebouncetext] = useState<string>("");

    useEffect(() => {

        const timer = setTimeout(() => {

            setdebouncetext(text);

        }, 300);

        return () => clearTimeout(timer);

    }, [text])




    const { data: searchResults, isLoading } = useQuery(
        trpc.creating_page.search.queryOptions({

            query: debouncetext,

        }, {
            enabled: debouncetext.length > 0,
        })
    )




    return (

        <>
            <motion.div initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className=" p-2 sticky top-0 z-50 w-full border-b border-primary/20 bg-background/85 supports-blackdrop-filter:bg-background/60 backdrop-blur">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">

                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" onClick={() => setActiveLink("Cenno")} className={cn(
                            "text-xl font-serif italic group hover:text-secondary-foreground transition-all hover:scale-110  duration-300", activeLink === "Cenno" ? "bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent" : "text-primary"
                        )}>
                            <motion.div className="text-xl cursor-pointer " whileTap={{ scale: 0.95 }} >

                                Cenno


                            </motion.div>
                        </Link>
                        <div className="hidden  md:flex items-center  gap-10 ">
                            {links.map(link => (
                                <Link key={link.name} href={link.href} onClick={() => setActiveLink(link.name)}
                                    className={cn(
                                        "relative group font-serif hover:scale-120 transiton-all duration-300", activeLink === link.name ? "text-primary" : "text-secondary-foreground/80 "
                                    )}>
                                    <motion.span className="text-lg hover:text-primary duration-300 transition-all">
                                        {link.name}
                                    </motion.span>

                                </Link>
                            ))}



                        </div>

                        <div className="flex gap-4 mt-1 justify-between">



                            <div className="flex gap-4 mt-1 justify-end">

                                <motion.button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full  border-border-primary bg-secondary/50 hover:bg-secondary transition-colors group" whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>


                                    <Search className="w-4 h-4 text-secondary-foreground group-hover:rotate-360 transition-all duration-500" />
                                    <span className="hidden sm:inline text-sm text-secondary-foreground/70">Search...</span>






                                </motion.button>




                            </div>

                            <ModeToggle />

                        </div>


                    </div>
                </div >
            </motion.div>





            <AnimatePresence>
                {searchOpen && (
                    <motion.div initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0  z-80 top-0 h-screen bg-background/70 border-none backdrop-blur-sm overflow-y-auto">

                        <div className="fixed top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none">

                            <Image src="/waves1.png" alt="Search" className="w-full h-full object-cover" width={1920} height={1080} />

                        </div>

                        <div className="relative  flex  flex-col items-center w-full min-h-screen p-4 pt-8">
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
                                    value={text}
                                    onChange={(e) => SetText(e.target.value)}
                                    className="px-4 py-2 p-2 w-160 pl-10 border-0 border-b-2
                                border-gray-800 focus:border-primary focus:outline-none transition placeholder-gray-400 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-none" />
                            </motion.div>


                            {isLoading &&
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }} className="flex items-center justify-center mt-4 ">
                                    <Loader2 className="w-6 h-6 animate-spin text-secondary" />


                                </motion.div>}


                            {!isLoading && searchResults && (
                                <motion.div initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }} className="mt-6 w-full max-w-screen backdrop-blur-xl  h-screen flex justify-center  ">

                                    {searchResults.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-4">
                                            No Posts Found for  + {text}

                                        </div>

                                    ) : (<motion.div>
                                        {searchResults.map((data: any) => (
                                            <Link
                                                key={data.id}
                                                href={`/Blog/${data.slug}`}
                                                onClick={() => {
                                                    setSearchOpen(false);
                                                    SetText("");
                                                }}
                                                passHref
                                            >
                                                <Card
                                                    className="cursor-pointer mb-3 hover:scale-[1.02] max-w-2xl transition-transform duration-200 border-none bg-blur shadow-secondary-foreground"
                                                >
                                                    <CardContent>
                                                        <h3 className="text-lg font-semibold text-primary hover:underline hover:decoration-secondary hover:decoration-2  duration-300 transition-all">{data.title}</h3>
                                                        <p className="text-sm text-secondary-foreground">
                                                            {data.excerpt || "Click to read more..."}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </motion.div>
                                    )}





                                </motion.div>
                            )}




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
            </AnimatePresence >
        </>
    )


}