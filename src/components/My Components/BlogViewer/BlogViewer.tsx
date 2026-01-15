"use client";

import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { useState } from "react";
import styles from "./BlogRender.module.css"


type Blogs = {
    id: string;
    slug: string;
    title: string;
    contentHTML: string;
    featuredImg: string | null;
    Author: string | null;
    published: Date | null;




}

export default function BlogViewer({ intialBlogs }: { intialBlogs: Blogs }) {


    const [blogdetail, setblogdetail] = useState(intialBlogs);

    const DatePublished = blogdetail.published ? new Date(blogdetail.published).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : "Not Published get better and put the data "






    return (
        <>
            <div className="min-h-screen overflow-x-auto overflow-y-hidden  flex-col items-center justify-center relative">




                <div className="flex items-center whitespace-normal wrap-break-word m-2 p-2  flex-col relative">
                    <div className="flex min-w-screen w-full opacity-80 relative ">

                        <div className="w-full h-[600px] overflow-hidden rounded-lg relative flex flex-col justify-end items-center pb-4">
                            <Image
                                src={blogdetail.featuredImg ?? ""}
                                alt={blogdetail.title}
                                width={800}   // container width
                                height={300}  // container height
                                style={{
                                    objectFit: "cover",       // fill and crop
                                    objectPosition: "center 10% " // center automatically
                                }}
                                className="absolute inset-0 w-full h-full bg-red-500"
                            />
                            <div className="absolute inset-0 bg-white/40 "></div>
                            <div className="relative z-10 text-sm font-medium p-5 mb-6">{DatePublished}</div>
                            <div className="relative z-10 text-6xl mb-10 p-4 max-w-226  text-primary-foreground text-center font-semibold px-4">
                                {blogdetail.title}

                            </div>
                        </div>

                    </div>
                    <div className="max-w-226 bg-red-500 w-full text-xl text-secondary-foreground border-b-2 border-b-secondary mt-2">

                        <div className="text-secondary-foreground ">

                            <div className="blog-Content prose prose-lg prose-indigo" dangerouslySetInnerHTML={{ __html: blogdetail.contentHTML }} />





                    </div>
                </div>






            </div >




        </div >
        </>
    )
}