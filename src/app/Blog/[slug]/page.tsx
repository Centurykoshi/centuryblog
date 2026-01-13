import BlogViewer from "@/components/My Components/BlogViewer/BlogViewer";
import prisma from "@/lib/prisma";

export default async function page({ params }: { params: { slug: string } }) {

    const { slug } = await await params;

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

        }
    })

    if (!BlogDetails) {
        return <div className="absolute top-1/2 text-4xl"> Blog not found get better </div>
    }

    return (
        <>
            <BlogViewer intialBlogs={BlogDetails} />
        </>
    )
}