"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import BlogCard from "./BlogCard"
import { blogPosts } from "@/data/blogPosts"

export default function Blogging() {
    const Category = [
        { name: "All" },
        { name: "Tech" },
        { name: "LifeStyle" },
        { name: "Travel" },
        { name: "Games" }

    ]

    const [iscategory, setIscategory] = useState("All");
    

    return (
        <div className="flex  gap-3 sm:gap-6 relative flex-col">
            <div className="flex gap-3 justify-center sm:gap-6">
                {Category.map((category) => (
                    <motion.div
                        key={category.name}
                        className="relative border-none"
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
            </div>

            <div className="flex  ml-[30vh] p-2 flex-col lg:ml-[30vh] gap-6 mt-10 sm:ml-[10vh]">

                <h2 className="text-2xl font-sans">Articles and Blogs</h2>

            </div>



            <div className="flex flex-col ml-[30vh] sm:ml-[10vh] gap-6 lg:ml-[30vh] ">
                {blogPosts.filter((blog) => iscategory === "All" || blog.category === iscategory).map((blog) => <BlogCard blog={blog} key={blog._id} onTitleClick={setIscategory} />)}

            </div>


        </div >

    )
}