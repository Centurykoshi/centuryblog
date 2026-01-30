
import Link from "next/link";

import { Search, XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./header";
import Blogging from "./Blogging";
import Model from "./model";
import Footer from "./footer";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function Frontpage() {

    const BlogDetails = await prisma.document.findMany({

        where: {
            status: "PUBLISHED"
        },

        select: {
            id: true,
            title: true,
            slug: true,
            Tag: true,
            contentHTML: true,
            contentJSON: true,
            excerpt: true,
            featuredImg: true,

        },

        orderBy: {
            createdAt: "desc"
        }

    });


    // Only pass required data to Model component
    const imageData = BlogDetails.map(blog => ({
        featuredImg: blog.featuredImg,
        slug: blog.slug
    }));


    const viewsData = await prisma.document.findMany({
        where: {
            status: "PUBLISHED",
        },
        select: {
            id: true,
            title: true,
            slug: true,
            Tag: true,
            Views: true,
        },
        orderBy: {
            Views: "desc"
        },
        take: 10,

    });





    return (
        <>

            <Header />
            <Model ImageDetailsP={imageData} />
            <Blogging initialDetails={BlogDetails} ViewsData={viewsData} />
            <Footer />






        </>
    )
}