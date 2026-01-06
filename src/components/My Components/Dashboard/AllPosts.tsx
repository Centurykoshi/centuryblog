
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Edit, NotebookTabsIcon, PackageIcon } from "lucide-react";
import Link from "next/link";




export default async function AllPosts() {

    const posts = await prisma.document.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
        }
    })
    return (
        <div>
            <div className="absolute top-20 left-1/5 ">


                <div className="border-2 p-8 text-secondary/40 rounded-2xl">



                    <div className="w-[60vw]">
                        <div className="grid grid-cols-4 gap-10 p-2 pb-10 pt-10 text-lg text-primary-foreground font-semibold border-b bg-secondary/29 rounded-s text-center">
                            <div>Serial No</div>
                            <div>Post Title</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>

                        <div>
                            {posts.map((post, index) => (
                                <div key={post.id} className={cn("grid grid-cols-4 gap-10 p-6 text-lg text-primary text-shadow-m text-center border-b last:border-b-0")}>
                                    <div className="text-secondary font-semibold">{index + 1}</div>
                                    <div className="flex gap-2 justify-between"><span>{post.title} </span><Link href={`/dashboard/edit/${post.slug}`}> <Edit className="w-5 h-5 text-right m-1 hover:rotate-360 hover:text-secondary-foreground transition-all ease-in-out duration-700 cursor-pointer" /></Link> </div>
                                    <div>{post.status}</div>
                                    <div>{/* actions placeholder */}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>


        </div>






    )
}