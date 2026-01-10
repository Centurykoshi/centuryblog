"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Status = "PUBLISHED" | "DRAFT" | "UNPUBLISH";

type Props = {
  value: Status | "All";
  onChange: (status: Status | "All") => void;
};

export default function FilterPostComponent({ value, onChange }: Props) {
  const states: (Status | "All")[] = [
    "All",
    "PUBLISHED",
    "DRAFT",
    "UNPUBLISH",
  ];

  return (
    <>
      <div className="flex justify-center">
        <motion.div className="flex gap-2 sm:gap-6">
          {states.map((state, index) => (
            <motion.div key={state}
            className="relative border-none" 
            initial={{opacity : 0, scale : 0.8}}
            animate={{opacity : 1, scale : 1}}
            transition={{delay : index * 0.2, duration : 0.3}}
            whileHover={{scale : 0.9}}
            whileTap={{scale : 0.95}}>
              <Button
               
                variant="ghost"
                className={cn(
                  "border-none font-medium text-base relative z-10 transition-colors duration-200 text-secondary-foreground/70",
                  value === state && "text-secondary-foreground"
                )}
                onClick={() => onChange(state)}
              >
                {state}

                {state === value && (<motion.div layoutId="activeButton" className="absolute inset-0 bg-primary/60 rounded-lg -z-10 blur"/>)}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
