"use client";
import { Card } from "@/components/ui/card";
import { blogPosts } from "@/data/blogPosts";
import { cn } from "@/lib/utils";




export default function AllPosts() {
    return (
        <div>
            <div className="absolute top-20 left-1/5 ">


                <div className="border-2 p-8 text-secondary/40 rounded-2xl">



                    <div className="w-[60vw]">
                        <div className=" grid grid-cols-4 gap-10 p-2 pb-10 pt-10  text-lg text-primary-foreground font-semibold border-b/20 bg-secondary/29 rounded-s text-center">
                            <div>Serial No </div>
                            <div> Post Title </div>
                            <div> Category </div>
                            <div> Satus </div>
                        </div>

                        <div >

                            {blogPosts.map((blog, index) => (
                                <div key={blog._id} className={cn("grid grid-cols-4 gap-10 p-6 text-lg text-primary text-shadow-m text-center border-b", index === blogPosts.length -1 ? "border-none" : "border-b" )}>
                                    <div className="text-secondary font-semibold">{blog._id} </div>
                                    <div>{blog.title} </div>
                                    <div> {blog.category} </div>
                                </div>

                            ))}
                        </div>
                    </div>

                </div>
            </div>


        </div>






    )
}