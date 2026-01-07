import AllPosts from "@/components/My Components/Dashboard/AllPosts";
import prisma from "@/lib/prisma";


export default async function EditingPageFront() {

    const Posts = await prisma.document.findMany({
        select : { 
            id : true, 
            title : true, 
            slug : true, 
            status : true, 
        }
    })


    return (
        <>
            <AllPosts initialPosts={Posts}/>
        </>
    );
}