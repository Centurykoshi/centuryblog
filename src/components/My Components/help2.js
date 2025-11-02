"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewPostButton() {
    const router = useRouter();
    const trpc = useTRPC();
    const [isCreating, setIsCreating] = useState(false);

    // ✅ Use mutateAsync for async/await support
    const createpost = trpc.creating_page.createpage.useMutation();

    const handleCreatePost = async () => {
        setIsCreating(true);
        toast.loading("Creating post...", { id: "createpost" });

        try {
            // ✅ Use mutateAsync with await
            const data = await createpost.mutateAsync({
                title: "Untitled Post",
                contentJSON: JSON.stringify({
                    type: "doc",
                    content: []
                })
            });

            // Success
            toast.success("Post created!", { id: "createpost" });
            setIsCreating(false);
            
            // Navigate to the new post
            router.push(data.url);
            
        } catch (error: any) {
            // Error handling
            toast.error("Error: " + (error.message || "Failed to create post"), { id: "createpost" });
            console.error("Error creating new page", error);
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg">
            <div className="flex-col flex justify-center items-center">
                <img
                    src="/createbro.svg"
                    alt="Create Post Icon"
                    className="w-96 h-96"
                />

                <motion.div 
                    whileHover={{ scale: 1.05, rotate: [0, 8, -8, 0] }} 
                    whileTap={{ scale: 0.95 }} 
                    transition={{ duration: 0.6, ease: "easeInOut" }} 
                    className="mt-4"
                >
                    <Button 
                        className="bg-linear-to-r from-primary to-secondary-foreground/80" 
                        onClick={handleCreatePost}
                        disabled={isCreating}
                    >
                        {isCreating ? "Creating..." : "Create Post"}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}