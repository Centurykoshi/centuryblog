"use client";


import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewPostButton() {


    const [creating, setiscreating] = useState(false);

    const trpc = useTRPC();
    const router = useRouter();

    const createpost = useMutation(trpc.creating_page.createpage.mutationOptions({
    }));

    const handleCreatePost = async () => {
        setiscreating(true);
        toast.loading("Creating post...", { id: "createpost" });

        try {
            const data = await createpost.mutateAsync({
                title: "Untitled Post",
                contentJSON: JSON.stringify({
                    type: "doc",
                    content: []
                })
            });

            toast.success("Post created!", { id: "createpost" });
            setiscreating(false);
            router.push(data.url);
        } catch (error: any) {
            toast.error("Error: " + (error.message || "Failed to create post"), { id: "createpost" });
            console.error("Error creating new page", error);
            setiscreating(false);
        }




    };


    // const CreatePage = useMutation(trpc.creating_page.createpage.mutationOptions({
    //     onSuccess: (data) => {
    //         setiscreating(false);
    //         toast.success("Post created!", { id: "createpost" });
    //         router.push(data.url);
    //     },

    //     onError: (error) => {
    //         toast.error("Error : " + error);
    //     }


    //     // Goes to: /dashboard/Edit/untitled-post
    // }));
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg">
            <div className="flex-col flex  justify-center items-center">
                <img
                    src="/createbro.svg"
                    alt="Create Post Icon"
                    className="w-96 h-96"
                />

                <motion.div whileHover={{ scale: 1.05, rotate: [0, 8, -8, 0] }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.6, ease: "easeInOut" }} className="mt-4">
                    <Button className="bg-linear-to-r from-primary to-secondary-foreground/80" onClick={handleCreatePost}>{creating ? "Creating..." : "Create Post"}</Button>
                </motion.div>
            </div>
        </div>
    )
}