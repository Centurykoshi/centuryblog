"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Tags = "All" | "Tech" | "LifeStyle" | "Games" | "Travel";

type Props = {
    value: Tags;
    onChange: (tag: Tags) => void;
};


export default function TagsSelection({ value, onChange }: Props) {


    const category: (Tags)[] = [
        "All",
        "Games",
        "LifeStyle",
        "Tech",
        "Travel",
    ];


    return (
        <>
            <div className="flex justify-center">
                <motion.div className="flex gap-2 sm:gap-6">
                    {category.map((category, index) => (
                        <motion.div key={category}
                            className="relative border-none"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2, duration: 0.3 }}
                            whileHover={{ scale: 0.9 }}
                            whileTap={{ scale: 0.95 }}>
                            <Button

                                variant="ghost"
                                className={cn(
                                    "border-none font-medium text-base relative z-10 transition-colors duration-200 text-secondary-foreground/70",
                                    value === category && "text-secondary-foreground"
                                )}
                                onClick={() => onChange(category)}
                            >
                                {category}

                                {category === value && (<motion.div layoutId="activeButton" className="absolute inset-0 bg-primary/60 rounded-lg -z-10 blur" />)}
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </>
    )




}