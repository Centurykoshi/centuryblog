"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import BlogCard from "./BlogCard"
import { blogPosts } from "@/data/blogPosts"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

type Details = {
    id: string;
    title: string;
    slug: string;
    contentHTML: string;
    Tag: "All" | "Tech" | "LifeStyle" | "Games" | "Travel";
    excerpt: string;

}

type Views = {
    id: string;
    title: string;
    slug: string;
    Tag: "All" | "Tech" | "LifeStyle" | "Games" | "Travel";
    Views: number | null;
}

export default function Blogging({ initialDetails, ViewsData }: { initialDetails: Details[], ViewsData: Views[] }) {
    const Category = [
        { name: "All" },
        { name: "Tech" },
        { name: "LifeStyle" },
        { name: "Travel" },
        { name: "Games" }

    ]

    const [iscategory, setIscategory] = useState("All");

    const [details, setdetails] = useState(initialDetails);


    const filteredDetails = details.filter(detail => {
        if (iscategory === "All") return true;
        return detail.Tag === iscategory;
    });

    const ViewsFilteredData = ViewsData.filter(view => {
        if (iscategory === "All") return true;
        return view.Tag === iscategory;
    })



    return (
        <motion.div
            className="flex  gap-3 sm:gap-6 relative flex-col mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="flex gap-3 justify-center sm:gap-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                {Category.map((category, index) => (
                    <motion.div
                        key={category.name}
                        className="relative border-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant={"ghost"}
                            className={cn(
                                "border-none font-medium text-base relative z-10 transition-colors duration-200 ",
                                iscategory === category.name && "text-primary-foreground"
                            )}
                            onClick={() => setIscategory(category.name)}
                        >
                            {category.name}

                            {iscategory === category.name && (
                                <motion.div
                                    layoutId="activeButton"
                                    className="absolute inset-0 bg-primary rounded-lg -z-10 blur"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Button>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">

                <div className="">

                    <div className="flex mb-4 ml-[30vh]  flex-col lg:ml-[30vh] gap-6 mt-10 sm:ml-[10vh]">

                        <h2 className="text-2xl font-sans text-secondary-foreground">Articles and Blogs</h2>

                    </div>



                    <div className="flex flex-col ml-[30vh] sm:ml-[10vh] gap-6 lg:ml-[30vh] ">
                        {filteredDetails.map((blog) => <BlogCard blog={blog} key={blog.id} onTitleClick={setIscategory} />)}

                    </div>
                </div>


                <div className="mt-10">
                    <div className="flex flex-col gap-6 mt-10 sm:ml-[10vh] sticky top-20 self-start">
                        <div className="flex justify-center">
                            <div className="flex-col flex gap-6 w-full max-w-md">
                                <h2 className="text-2xl font-bold text-secondary-foreground flex items-center gap-2">
                                    🔥 Popular Content
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {ViewsFilteredData.slice(0, 5).map((blog, index) => (
                                        <Link
                                            key={blog.id}
                                            href={`/Blog/${blog.slug}`}
                                            className="group block no-underline"
                                        >
                                            <motion.div
                                                className="p-4 rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all duration-300"
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl font-bold text-primary/60 min-w-[2rem]">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                            {blog.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                                                {blog.Tag}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {(blog.Views || 0).toLocaleString()} views
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" />
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div >

    )
}