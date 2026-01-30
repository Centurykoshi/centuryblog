import Navbar from "@/components/CreatePage/Navbar";
import BlogViewer from "@/components/My Components/BlogViewer/BlogViewer";
import Header from "@/components/My Components/header";
import prisma from "@/lib/prisma";
import { unstable_noStore } from "next/cache";


export default async function page({ params }: { params: { slug: string } }) {

    unstable_noStore();

    const { slug } = await params;

    const BlogDetails = await prisma.document.findUnique({


        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            contentHTML: true,
            featuredImg: true,
            Author: true,
            published: true,
            contentJSON: true,
            Views: true,

        }
    });


    if (!BlogDetails) {
        return <div className="absolute top-1/2 text-4xl"> Blog not found get better </div>
    }

    return (
        <>
            <Header />
            <BlogViewer intialBlogs={BlogDetails} />
        </>
    )
}