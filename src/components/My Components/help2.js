"use client";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Edit, NotebookTabsIcon, PackageIcon, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DropPublishDraft from "../Posts Components/DropDownP";
import { Button } from "@/components/ui/button";


type Posts = {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "UNPUBLISH";
}

export default function AllPosts({ initialPosts }: { initialPosts: Posts[] }) {

    const [posts, setPosts] = useState(initialPosts);
    const [pendingChanges, setPendingChanges] = useState<Record<string, "DRAFT" | "PUBLISHED" | "UNPUBLISH">>({});

    const trpc = useTRPC();

    const UpdateDocumentStatus = useMutation(trpc.creating_page.updateDocument.mutationOptions({
    }));


    useEffect(() => {
        if (UpdateDocumentStatus.isSuccess) {
            toast.success("Updated Successfully ");
        }
        if (UpdateDocumentStatus.isError) {
            toast.error("Failed to update the status: " + UpdateDocumentStatus.error?.message);
        }
    }, [UpdateDocumentStatus.isSuccess, UpdateDocumentStatus.isError]);



    const handleStatusChange = (postId: string, newStatus: "DRAFT" | "PUBLISHED" | "UNPUBLISH") => {
        setPendingChanges(prev => ({ ...prev, [postId]: newStatus }));
    };


    const handlesave = async (post: Posts) => {
        const pendingStatus = pendingChanges[post.id];
        if (!pendingStatus) return;

        try {
            await UpdateDocumentStatus.mutateAsync({
                slug: post.slug,
                status: pendingStatus
            });

            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: pendingStatus } : p));

            setPendingChanges(prev => {
                const { [post.id]: _, ...rest } = prev;
                return rest;
            });

        } catch (error) {
            console.error("Error updating document status:", error);
            toast.error("Failed to update status");
        }
    }


    return (
        <div>
            <div className="absolute top-20 left-1/5 ">


                <div className="border-2 p-8 text-secondary/40 rounded-2xl">



                    <div className="w-[60vw]">
                        <div className="grid grid-cols-4 gap-10 p-2 pb-10 pt-10 text-lg text-primary-foreground font-semibold border-b bg-secondary/29 rounded-s text-center">
                            <div>Serial No</div>
                            <div>Post Title</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>

                        <div>
                            {posts.map((post, index) => {
                                const currentStatus = pendingChanges[post.id] || post.status;
                                const hasChanges = pendingChanges[post.id] && pendingChanges[post.id] !== post.status;
                                return (
                                    <div key={post.id} className={cn("grid grid-cols-4 gap-10 p-6 text-lg text-primary text-shadow-m text-center border-b last:border-b-0")}>
                                        <div className="text-secondary font-semibold">{index + 1}</div>
                                        <div className="flex gap-2 justify-between"><span>{post.title} </span><Link href={`/dashboard/edit/${post.slug}`}> <Edit className="w-5 h-5 text-right m-1 hover:rotate-360 hover:text-secondary-foreground transition-all ease-in-out duration-700 cursor-pointer" /></Link> </div>
                                        <div className="captilize text-sm"><span className={cn("px-2 py-1 rounded-sm text-xs font-medium", post.status === "PUBLISHED" && "bg-secondary text-primary-foreground", post.status === "DRAFT" && "bg-primary-foreground/20 text-primary-foreground", post.status === "UNPUBLISH" && "bg-secondary/40 text-secondary-foreground")}>{post.status}</span></div>
                                        <div className=" flex gap-2 justify-between"><DropPublishDraft value={currentStatus} onchange={(newStatus) => handleStatusChange(post.id, newStatus)} />
                                            <span><Button className="w-10" variant={hasChanges ? "default" : "outline"} onClick={() => handlesave(post)} disabled={UpdateDocumentStatus.isPending || !hasChanges}><Save className="w-4 h-4" /></Button> {hasChanges && (<span className="text-xs text-foreground/50"> {pendingChanges[post.id]}</span>)}</span>
                                        </div>


                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </div>


        </div>






    )
}