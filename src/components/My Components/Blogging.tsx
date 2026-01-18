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
    excerpt : string;




}

export default function Blogging({ initialDetails }: { initialDetails: Details[] }) {
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
                            <div className="flex-col flex gap-10">
                                <h2 className="text-xl font-sans text-secondary-foreground"> Popular Content </h2>

                                <div className="flex flex-col gap-2">

                                    {filteredDetails.map((blog) => (
                                        <Link
                                            key={blog.id}
                                            href={`/blog/${blog.title}`}
                                            className="group inline-block no-underline transition-colors hover:text-secondary-foreground"
                                        >
                                            <motion.div
                                                className="inline-block"
                                                initial={{ x: 0 }}
                                                animate={{ x: 0 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            >
                                                <ArrowRight className="w-6 h-6 inline mb-2 mr-2 transition-all duration-300 group-hover:translate-x-2 " />
                                            </motion.div>
                                            <span className="inline text-xl font-semibold cursor-pointer ">
                                                {blog.title.slice(0, 60) + "..."}
                                            </span>
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