import AllPosts from "@/components/My Components/Dashboard/AllPosts";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditingPageFront() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/")
    }

    const Posts = await prisma.document.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            status: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })


    return (
        <>
            <Suspense fallback={<div> Loading..... </div>}>
                <AllPosts initialPosts={Posts} />

            </Suspense>
        </>
    );
}