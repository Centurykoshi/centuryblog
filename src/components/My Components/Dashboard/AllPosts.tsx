"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import DropPublishDraft from "../Posts Components/DropDownP";
import { Button } from "@/components/ui/button";
import { PostStatus } from "@/generated/prisma";
import FilterPostComponent from "../Posts Components/FilterComponent";
import { useSearchParams } from "next/navigation";


type Posts = {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "UNPUBLISH";
}


export default function AllPosts({ initialPosts }: { initialPosts: Posts[] }) {

    const searchParams = useSearchParams();

    const [posts, setPosts] = useState(initialPosts);
    const [pendingChanges, setPendingChanges] = useState<Record<string, "DRAFT" | "PUBLISHED" | "UNPUBLISH">>({});
    type FilterType = "All" | "DRAFT" | "PUBLISHED" | "UNPUBLISH";




    const [filter, setFilter] = useState<FilterType>("All");

    //.filter() works lthis : if your function returns true keep the itme if it returns false remove the item checks for only true and false. 
    useEffect(() => {
        const filterParam = searchParams.get('filter') as FilterType;
        if (filterParam && ["All", "PUBLISHED", "DRAFT", "UNPUBLISH"].includes(filterParam)) {
            setFilter(filterParam);
        }
    }, [searchParams]);

    const filteredPosts = posts.filter(post => {
        if (filter === "All") return true;
        return post.status === filter;
    })
    const trpc = useTRPC();

    const UpdateDocumentSatus = useMutation(trpc.creating_page.updateDocument.mutationOptions({
    }));


    useEffect(() => {
        if (UpdateDocumentSatus.isSuccess) {
            toast.success("Updated Successfully");
        }
        if (UpdateDocumentSatus.isError) {
            toast.error("Failed to update the status");
        }
    }, [UpdateDocumentSatus.isSuccess, UpdateDocumentSatus.isError]);



    const handleStatusChange = (postId: string, newStatus: "DRAFT" | "PUBLISHED" | "UNPUBLISH") => {
        setPendingChanges(prev => ({ ...prev, [postId]: newStatus }));
    };


    const handlesave = async (post: Posts) => {
        const pendingStatus = pendingChanges[post.id];
        if (!pendingStatus) return;

        try {
            await UpdateDocumentSatus.mutateAsync({
                id: post.id,
                status: pendingStatus
            });

            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: pendingStatus } : p));

            setPendingChanges(prev => {
                const { [post.id]: _, ...rest } = prev;
                return rest;
            });

        } catch (error) {
            console.error("Something went wrong" + error);
        }
    }

    const queryClient = useQueryClient();

    const deleteConversation = useMutation(trpc.creating_page.deletepage.mutationOptions({
        onSuccess: (_, variables) => {

            setPosts(prev => prev.filter(p => p.slug !== variables.slug));



            toast.success("Post Deleted Succefufllyu");


        },
        onError: () => {
            toast.error("Failed to delete post something went wrong");
        }


    }));

    const handleDelete = (slug: string, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        deleteConversation.mutate({ slug });

        console.log("Delete post:", slug);
        toast.success("Post deleting wait for confirmation ");
    }


    return (
        <div>

            <motion.div
                initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1 }}>
                <div className="absolute top-20 left-1/5">
                    <div className="border-2 p-8 text-secondary/40 rounded-2xl">
                        <div className="w-[60vw]">
                            <div className="p-4 mb-2">
                                <FilterPostComponent value={filter} onChange={setFilter} />
                            </div>
                            <div className="grid grid-cols-5 gap-6 p-2 pb-10 pt-10 text-lg text-primary-foreground font-semibold border-b bg-secondary/29 rounded-s text-center">
                                <div>Serial No</div>
                                <div>Post Title</div>
                                <div>Status</div>
                                <div>Changes</div>
                                <div>Actions</div>
                            </div>

                            <div>
                                {filteredPosts.map((post, index) => {
                                    const currentStatus = pendingChanges[post.id] || post.status;
                                    const hasChanges = pendingChanges[post.id] && pendingChanges[post.id] !== post.status;
                                    return (
                                        <div key={post.id} className={cn("grid grid-cols-5 gap-6 p-6 text-lg text-primary text-shadow-m text-center border-b last:border-b-0 items-center")}>
                                            <div className="text-secondary font-semibold">{index + 1}</div>
                                            <div className="text-left">{post.title}</div>
                                            <div>
                                                <span className={cn("px-2 py-1 rounded-sm text-xs font-medium",
                                                    post.status === "PUBLISHED" && "bg-secondary text-primary-foreground",
                                                    post.status === "DRAFT" && "bg-primary-foreground/20 text-primary-foreground",
                                                    post.status === "UNPUBLISH" && "bg-secondary/40 text-secondary-foreground"
                                                )}>
                                                    {post.status}
                                                </span>
                                            </div>
                                            <div>
                                                <DropPublishDraft
                                                    value={currentStatus}
                                                    onchange={(newStatus) => handleStatusChange(post.id, newStatus)}
                                                />
                                                {hasChanges && (
                                                    <div className="text-xs text-foreground/50 mt-1">
                                                        → {pendingChanges[post.id]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 justify-center">
                                                <Link href={`/dashboard/edit/${post.id}`}>
                                                    <Button variant="outline" size="icon" className="w-8 h-8">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant={hasChanges ? "default" : "outline"}
                                                    size="icon"
                                                    className="w-8 h-8"
                                                    onClick={() => handlesave(post)}
                                                    disabled={UpdateDocumentSatus.isPending || !hasChanges}
                                                >
                                                    <Save className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="w-8 h-8 hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => handleDelete(post.slug)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}