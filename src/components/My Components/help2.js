"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function BlogCard({ blog }: { blog: any }) {

    const { title, description, category, _id } = blog;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div 
            className="flex flex-col justify-start p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
        >
            {/* Category Badge */}
            <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-3 py-1 rounded-full w-fit mb-3">
                {category}
            </span>

            {/* Title */}
            <h2 className="mb-4">
                <Link 
                    href={`/blog/${title}`} 
                    className="no-underline text-xl font-semibold hover:underline hover:decoration-primary hover:decoration-2 hover:underline-offset-2" 
                    style={{ textDecorationSkipInk: "auto" }}
                >
                    {title}
                </Link>
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                {description}
            </p>

            {/* Read More Link */}
            <Link 
                href={`/blog/${title}`} 
                className="no-underline flex items-center gap-2 text-pink-500 font-semibold hover:gap-3 transition-all"
            >
                <span className="hover:underline">Read more</span>
                <ArrowRight className="w-4 h-4" />
            </Link>

        </motion.div>
    )
}