"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

const themes = [
  { name: "Light", value: "light", colors: "bg-white text-black" },
  { name: "Dark", value: "dark", colors: "bg-zinc-950 text-white" },
  { name: "Ocean", value: "ocean", colors: "bg-blue-950 text-blue-50" },
  { name: "Forest", value: "forest", colors: "bg-green-950 text-green-50" },
  { name: "Sunset", value: "sunset", colors: "bg-orange-950 text-orange-50" },
  { name: "Purple", value: "purple", colors: "bg-purple-950 text-purple-50" },
  { name: "Rose", value: "rose", colors: "bg-rose-950 text-rose-50" },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-secondary/50"
      >
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-border-primary bg-secondary/50 hover:bg-secondary transition-colors group"
        >
          <Palette className="h-4 w-4 text-secondary-foreground transition-all duration-500" />
          <span className="hidden sm:inline text-sm text-secondary-foreground/70">Theme</span>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`w-4 h-4 rounded-full ${themeOption.colors} border border-border`} />
              <span className="flex-1">{themeOption.name}</span>
              {theme === themeOption.value && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
