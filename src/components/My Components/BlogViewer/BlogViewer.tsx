"use client";

import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { useState } from "react";

type Blogs = {
    id: string;
    slug: string;
    title: string;
    contentHTML: string;
    featuredImg: string | null;



}

export default function BlogViewer({ intialBlogs }: { intialBlogs: Blogs }) {


    const [blogdetail, setblogdetail] = useState(intialBlogs);






    return (
        <>
            <div className="min-h-screen overflow-x-auto overflow-y-hidden  flex-col items-center justify-center bg-red-500 relative">




                <div className="flex items-center whitespace-normal wrap-break-word m-2 p-2  flex-col relative">
                    <div className="flex max-w-226 w-full opacity-80 bg-secondary/20">
                        <div className="w-full h-[300px] overflow-hidden rounded-lg">
                            <Image
                                src={blogdetail.featuredImg ?? ""}
                                alt={blogdetail.title}
                                width={800}   // container width
                                height={300}  // container height
                                style={{
                                    objectFit: "cover",       // fill and crop
                                    objectPosition: "center 10% " // center automatically
                                }}
                                className="w-full h-full"
                            />
                        </div>

                    </div>
                    <div className="max-w-226 w-full text-4xl text-secondary-foreground border-b-2 border-b-secondary mt-2">
                        {blogdetail.title}
                        <div className="text-secondary-foreground ">

                            <article dangerouslySetInnerHTML={{ __html: blogdetail.contentHTML }}>

                            </article>

                        </div>
                    </div>






                </div>




            </div>
        </>
    )
}