import AllPosts from "@/components/My Components/Dashboard/AllPosts";
import prisma from "@/lib/prisma";
import { Suspense } from "react";


export default async function EditingPageFront() {

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