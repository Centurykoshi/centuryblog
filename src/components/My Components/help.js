import BlogViewer from "@/components/My Components/BlogViewer/BlogViewer";
import prisma from "@/lib/prisma";

export default async function page({ params }: { params: { slug: string } }) {

    const { slug } = await params;

    const BlogDetails = await prisma.document.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            contentHTML: true,
            featuredImg: true,
            createdAt: true,
            published: true,
            Tag: true,
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    })

    if (!BlogDetails) {
        return <div className="absolute top-1/2 text-4xl"> Blog not found get better </div>
    }

    const related = await prisma.document.findMany({
        where: {
            status: "PUBLISHED",
            id: { not: BlogDetails.id },
            Tag: BlogDetails.Tag,
        },
        orderBy: { published: "desc" },
        take: 3,
        select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            featuredImg: true,
            published: true,
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    })

    // Make props client-component safe (no Date objects)
    const initialBlog = {
        id: BlogDetails.id,
        title: BlogDetails.title,
        slug: BlogDetails.slug,
        excerpt: BlogDetails.excerpt,
        contentHTML: BlogDetails.contentHTML,
        featuredImg: BlogDetails.featuredImg,
        createdAt: BlogDetails.createdAt.toISOString(),
        published: BlogDetails.published ? BlogDetails.published.toISOString() : null,
        tag: BlogDetails.Tag,
        author: {
            name: BlogDetails.user.name,
            image: BlogDetails.user.image,
            bio: null,
        },
    };

    const relatedPosts = related.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        featuredImg: r.featuredImg,
        published: r.published ? r.published.toISOString() : null,
        author: {
            name: r.user.name,
            image: r.user.image,
        },
    }));

    return (
        <>
            <BlogViewer intialBlogs={initialBlog} relatedPosts={relatedPosts} />
        </>
    )
}