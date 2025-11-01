import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NewPostButton() {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg">
            <div className="flex-col flex  justify-center items-center">
                <img
                    src="/createbro.svg"
                    alt="Create Post Icon"
                    className="w-96 h-96"
                />

                <motion.div whileHover={{ scale: 1.05, rotate: [0, 8, -8, 0] }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.6, ease: "easeInOut" }} className="mt-4">
                    <Button className="bg-linear-to-r from-primary to-secondary-foreground/80">Create Post</Button>
                </motion.div>
            </div>
        </div>
    )
}