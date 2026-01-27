"use client"

import * as React from "react"
import { Moon, Sun, Flame } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "amber-light", icon: Flame, label: "Amber" },
]

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);

    const currentTheme = themes.find(t => t.name === theme) || themes[0];
    const CurrentIcon = currentTheme.icon;

    return (
        <div className="relative">
            <Button 
                variant="outline" 
                onClick={() => setIsOpen(!isOpen)} 
                size="icon" 
                className="relative z-10"
            >
                <CurrentIcon className="w-6 h-6" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 overflow-hidden"
                    >
                        <div className="flex items-center gap-1 bg-background border rounded-md p-1">
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon
                                return (
                                    <motion.button
                                        key={themeOption.name}
                                        onClick={() => {
                                            setTheme(themeOption.name)
                                            setIsOpen(false)
                                        }}
                                        className={`p-2 rounded-md transition-colors hover:bg-accent ${
                                            theme === themeOption.name ? "bg-accent" : ""
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="sr-only">{themeOption.label}</span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
