"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils"; // Assuming you have your cn function
import { Button } from "@/components/ui/button";

type Status = "PUBLISHED" | "DRAFT" | "UNPUBLISH";

type Props = {
  value: Status | "All";
  onChange: (status: Status | "All") => void;
};

export default function FilterPostComponent({ value, onChange }: Props) {
  // Object approach for labels/colors
  const STATUS_OPTIONS: Record<Status | "All", { label: string }> = {
    All: { label: "All" },
    PUBLISHED: { label: "Published" },
    DRAFT: { label: "Draft" },
    UNPUBLISH: { label: "Unpublish" },
  };

  return (
    <motion.div
      className="flex gap-3 sm:gap-6 mb-10 justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {Object.entries(STATUS_OPTIONS).map(([status, { label }], index) => (
        <motion.div
          key={status}
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            className={cn(
              "border-none font-medium text-base relative z-10 transition-colors duration-200",
              value === status && "text-primary-foreground"
            )}
            onClick={() => onChange(status as Status | "All")}
          >
            {label}
            {value === status && (
              <motion.div
                layoutId="activeButton"
                className="absolute inset-0 bg-primary rounded-lg -z-10 blur"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
