"use client";



import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, } from "lucide-react";


type Blog = {
    id: string;
    title: string;
    slug: string;
    Tag: "All" | "Tech" | "LifeStyle" | "Games" | "Travel";
    excerpt: string;

}
export default function BlogCard({ blog, onTitleClick }: { blog: Blog, onTitleClick: (tag: string) => void }) {

    const [isHovered, setIsHovered] = useState(false);
    const [isHoveredRead, setIsHoveredRead] = useState(false);


    return (
        <motion.div className="flex flex-col justify-start  max-w-xl relative">
            <div className="">
                <h2 className="mb-4"><div className="no-underline text-xl font-semibold hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-2" onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)} style={{ textDecorationSkipInk: "auto" }}>{blog.title}</div></h2>
            </div>



            <p className="text-muted-foreground relative"> {blog.excerpt}</p>

            <div className="relative w-fit mb-4 mt-4 ">
                <motion.div
                    whileHover={{
                        scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
                        rotate: [0, -5, 5, -3, 3, 0],
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut", }}
                >
                    <Button
                        variant={"ghost"}
                        className="text-xs font-semibold text-muted-foreground border-none relative z-10 px-3 py-1"
                        onClick={() => onTitleClick(blog.Tag)}

                    >
                        {blog.Tag}
                        <div className="absolute inset-0 bg-primary rounded-lg -z-10 blur" />
                    </Button>

                </motion.div>

            </div>

            <Link href={`/Blog/${blog.slug}`} onClick={() => { }} className="cursor-pointer no-underline w-fit inline hover:animate-pulse text-sm font-semibold mt-2 "
                onMouseEnter={() => setIsHoveredRead(true)}
                onMouseLeave={() => setIsHoveredRead(false)}
            >
                Read more {isHovered && <ArrowRight className="w-4 h-4 inline opacity-100 animate-in fade-in transition-opacity duration-1000 text-primary-foreground/67" />}

                {isHoveredRead && (
                    <>
                        <ArrowRight className="w-4 h-4 inline ml-1 opacity-100 animate-in fade-in duration-2000 " />
                        <ArrowRight className="w-4 h-4 inline opacity-75 animate-in fade-in duration-2500 " />
                        <ArrowRight className="w-4 h-4 inline opacity-50 animate-in fade-in duration-3500 " />
                        <ArrowRight className="w-4 h-4 inline opacity-40 animate-in fade-in duration-4500 " />

                    </>
                )}
            </Link>

        </motion.div >


    )

}

