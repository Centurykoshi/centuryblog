"use client";

import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { useState } from "react";
import styles from "./BlogRender.module.css"



type Blogs = {
    id: string;
    slug: string;
    title: string;
    contentHTML: string;
    featuredImg: string | null;
    Author: string | null;
    published: Date | null;
    contentJSON: JSON;



}

export default function BlogViewer({ intialBlogs }: { intialBlogs: Blogs }) {


    const [blogdetail, setblogdetail] = useState(intialBlogs);

    const content = typeof blogdetail.contentJSON === "string" ? JSON.parse(blogdetail.contentJSON) : blogdetail.contentJSON;


    function groupedImages(nodes: any[]) {
        const result: any[] = [];
        let ImageGroup: string[] = [];

        for (const node of nodes) {
            if (node.type === "imageWithDelete") {
                ImageGroup.push(node.attrs.src);
            }
            else {
                if (ImageGroup.length) {
                    result.push({ type: "image-group", images: ImageGroup });
                    ImageGroup = [];
                }
                result.push(node);
            }
        }
        if (ImageGroup.length) {
            result.push({ type: "image-group", images: ImageGroup });
        }

        return result;
    }


    const groupedImagesdata = groupedImages(content.content);





    const DatePublished = blogdetail.published ? new Date(blogdetail.published).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : "Not Published get better and put the data ";



    function EditorBlocks({ node }: { node: any }) {
        if (node.type === "paragraph") {
            return (
                <p className="my-5 text-lg leading-relaxed text-secondary-foreground ">
                    {node.content?.map((t: any) => t.text).join("")}
                </p>
            );
        }

        if (node.type === "heading") {
            return (
                <h2 className="text-3xl font-semibold mt-10 mb-4 text-primary-foreground">
                    {node.content?.map((t: any) => t.text).join("")}

                </h2>
            );
        }

        

        return null;
    }








    return (
        <>
            <div className="min-h-screen overflow-x-auto overflow-y-hidden  flex-col items-center flex justify-center relative">





                <div className="w-full h-[600px] overflow-hidden rounded-lg relative flex flex-col justify-end items-center pb-4">
                    <Image
                        src={blogdetail.featuredImg ?? ""}
                        alt={blogdetail.title}
                        width={800}   // container width
                        height={300}  // container height
                        style={{
                            objectFit: "cover",       // fill and crop
                            objectPosition: "center 10% " // center automatically
                        }}
                        className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute inset-0 bg-white/40 "></div>
                    <div className="relative z-10 text-sm font-medium p-5 mb-6">{DatePublished}</div>
                    <div className="relative z-10 text-6xl mb-10 p-4 max-w-226  text-primary-foreground text-center font-semibold px-4">
                        {blogdetail.title}

                    </div>
                </div>

                <div className="max-w-6xl w-full px-4 py-10 ">
                    {groupedImagesdata.map((block, i) => {
                        if (block.type === "image-group") {
                            if (block.images.length === 1) {
                                return (
                                    <img
                                        key={i}
                                        src={block.images[0]}
                                        className="w-full h-full object-cover rounded-lg my-8"
                                    />
                                );

                            }

                            return (
                                <div key={i}
                                    className="grid grid-cols-2 gap-3 my-8"
                                > {block.images.map((src: string, j: number) =>
                                    <img key={j} src={src} className="h-full object-cover rounded-lg" />
                                )}
                                </div>
                            );
                        }

                        return <EditorBlocks key={i} node={block} />;
                    })}
                </div>

            </div>
        </>
    )
}