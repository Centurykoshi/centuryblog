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
    <div className="flex justify-center">
      <motion.div className="flex gap-2 sm:gap-6">
        {states.map((state) => (
          <Button
            key={state}
            variant="ghost"
            className={cn(
              "border-none font-medium text-base relative z-10 transition-colors duration-200",
              value === state && "text-primary-foreground"
            )}
            onClick={() => onChange(state)}
          >
            {state}
          </Button>
        ))}
      </motion.div>
    </div>
  );
}
