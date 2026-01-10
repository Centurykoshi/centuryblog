
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
        },

        orderBy: {
            createdAt: "desc"
        }

    })





    return (
        <>

            <Header />
            <Model />
            <Blogging initialDetails={BlogDetails} />
            <Footer />






        </>
    )
}