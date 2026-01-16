"use client";

import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import React, { useState } from "react";
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
                <p className="my-5 text-lg leading-relaxed text-secondary-foreground">
                    {node.content?.map((t: any, idx: number) => (
                        <span key={idx} className={t.marks?.some((m: any) => m.type === "bold") ? "font-bold" : ""}>
                            {t.text}
                        </span>
                    ))}
                </p>
            );
        }

        if (node.type === "heading") {
            const level = node.attrs?.level || 2;
            const Tag = `h${level}` as keyof React.IntrinsicElements;
            const sizeClasses = {
                1: "text-4xl",
                2: "text-3xl",
                3: "text-2xl",
                4: "text-xl",
                5: "text-lg",
                6: "text-base"
            };
            return (
                <Tag className={`${sizeClasses[level as keyof typeof sizeClasses]} font-semibold mt-10 mb-4 text-primary-foreground`}>
                    {node.content?.map((t: any) => t.text).join("")}
                </Tag>
            );
        }

        if (node.type === "bulletList") {
            return (
                <ul className="list-disc list-inside my-6 space-y-2 text-secondary-foreground">
                    {node.content?.map((item: any, idx: number) => (
                        <EditorBlocks key={idx} node={item} />
                    ))}
                </ul>
            );
        }

        if (node.type === "orderedList") {
            return (
                <ol className="list-decimal list-inside my-6 space-y-2 text-secondary-foreground">
                    {node.content?.map((item: any, idx: number) => (
                        <EditorBlocks key={idx} node={item} />
                    ))}
                </ol>
            );
        }

        if (node.type === "listItem") {
            return (
                <li className="text-lg leading-relaxed ml-4">
                    {node.content?.map((item: any, idx: number) => {
                        if (item.type === "paragraph") {
                            return item.content?.map((t: any, i: number) => (
                                <span key={i} className={t.marks?.some((m: any) => m.type === "bold") ? "font-bold" : ""}>
                                    {t.text}
                                </span>
                            ));
                        }
                        return <EditorBlocks key={idx} node={item} />;
                    })}
                </li>
            );
        }

        if (node.type === "blockquote") {
            return (
                <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 italic text-secondary-foreground bg-muted rounded-r-lg">
                    {node.content?.map((item: any, idx: number) => (
                        <EditorBlocks key={idx} node={item} />
                    ))}
                </blockquote>
            );
        }

        if (node.type === "horizontalRule") {
            return <hr className="my-8 border-t-2 border-border" />;
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