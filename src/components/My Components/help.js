"use client";
import { Card } from "@/components/ui/card";
import { blogPosts } from "@/data/blogPosts";




export default function AllPosts() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">All Posts</h2>

            <Card className="rounded-none">
                <div className="w-full">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 p-4 text-xl font-semibold border-b bg-gray-100">
                        <div>Serial No</div>
                        <div>Post Title</div>
                        <div>Category</div>
                        <div>Status</div>
                    </div>

                    {/* Data Rows */}
                    {blogPosts.map((blog, index) => (
                        <div key={blog._id} className="grid grid-cols-4 gap-4 p-4 border-b text-lg hover:bg-gray-50">
                            <div>{index + 1}</div>
                            <div>{blog.title}</div>
                            <div>{blog.category}</div>
                            <div>Active</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>






    )
}