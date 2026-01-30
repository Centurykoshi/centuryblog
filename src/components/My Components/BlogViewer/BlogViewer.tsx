"use client";

import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { useEffect } from "react";
import styles from "./BlogRender.module.css"
import GobackButton from "../GoBackButton";
import { useMutation } from "@tanstack/react-query";
import { Prisma } from "@/generated/prisma";



type Blogs = {
    id: string;
    slug: string;
    title: string;
    contentHTML: string;
    featuredImg: string;
    Author: string | null;
    published: Date | null;
    contentJSON: Prisma.JsonValue;
    Views: number;



}

export default function BlogViewer({ intialBlogs }: { intialBlogs: Blogs }) {

    const blogdetail = intialBlogs;

    const content = typeof blogdetail.contentJSON === "string" ? JSON.parse(blogdetail.contentJSON) : blogdetail.contentJSON;

    const key = `viewed-${blogdetail.id}`;

    const trpc = useTRPC();

    const incremnentviews = useMutation(trpc.creating_page.UserBlogTracking.mutationOptions({}));

    useEffect(() => {
        if (!sessionStorage.getItem(key)) {
            console.log("No session storage, incrementing views");
            incremnentviews.mutate(
                { id: blogdetail.id },
                {
                    onSuccess: () => {
                        sessionStorage.setItem(key, "true");
                    }
                }
            );
        }
    }, [blogdetail.id]);

    console.log("Here are total views for this : " + intialBlogs.Views);

    console.log("increment : " + incremnentviews);
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
    }) : "Not Published get better and put the data "




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
                <h2 className="text-3xl  font-serif font-semibold mt-10 mb-4 text-primary-foreground">
                    {node.content?.map((t: any) => t.text).join("")}

                </h2>
            );
        }

        if (node.type === "bulletList") {
            return (
                <ul className="space-y-2 text-secondary-foreground list-inside my-6 mx-6 list-disc pl-6">
                    {node.content?.map((item: any, i: number) => (
                        <li key={i}>{item.content?.[0]?.content?.map((t: any) => t.text).join("")}</li>
                    ))}

                </ul>
            )
        };

        if (node.type === "orderedList") {
            return (
                <ol className="space-y-2 marker:font-semibold marker:text-primary-foreground text-secondary-foreground list-inside pl-6 mx-6 list-decimal my-6">
                    {node.content?.map((item: any, i: number) => (<li
                        key={i} >
                        {item.content?.[0]?.content?.map((t: any) => t.text)}

                    </li>))}

                </ol>
            )
        }

        if (node.type === "horizontalRule") {
            return <hr className="my-8 border-t-2  border-t-secondary" />;
        }
        if (node.type === "blockquote") {
            return (
                <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 italic text-secondary-foreground bg-muted/40 rounded-r-lg">
                    {node.content?.map((item: any, idx: number) => (
                        <EditorBlocks key={idx} node={item} />
                    ))}
                </blockquote>
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
                    <div className="absolute inset-0 top-10 left-1/10 "><GobackButton Prop={{ value: "Go Back", url: "/" }} />
                    </div>
                    <div className="relative z-10 text-sm font-medium p-5 mb-6">{DatePublished}</div>
                    <div className="relative z-10 text-6xl mb-10 p-4 font-serif max-w-226  text-primary-foreground text-center font-semibold px-4">
                        {blogdetail.title}

                    </div>

                    <div className="relative z-10 text-primary-foreground left-1/8 bottom-1/10">
                        by {blogdetail.Author}
                    </div>
                </div>

                <div className="max-w-5xl w-full px-4 py-10 ">
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