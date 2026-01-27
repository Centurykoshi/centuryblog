"use client"

import * as React from "react"
import { Moon, MoonIcon, Sun, SunIcon, Flame, Bubbles, Coffee,  } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    { name: "amber-light", icon: Flame, label: "Amber" },
    { name: "bubblegum", icon: Bubbles, label: "Bubble" },
    { name: "coffee", icon: Coffee, label: "coffee" },
    { name: "ocean", icon: SunIcon, label: "ocean" },

]

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    const [isopen, setIsOpen] = React.useState(false);

    const currentTheme = themes.find(t => t.name === theme) || themes[0];
    const CurrentIcon = currentTheme.icon;

    return (
        <div className="relative ">
            <Button variant={"outline"} onClick={() => setIsOpen(!isopen)} size="icon" className="relative z-10">

                <CurrentIcon className="w-6 h-6" />

            </Button>

            {isopen && (
                <div className="absolute left-1/2 mt-2 -translate-x-1/2  overflow-hidden max-w-2xl max-h-15 duration-300 transition-all ease-in-out ">

                    <div className="flex items-center gap-1 bg-background border border-b-secondary rounded-lg p-2 ">
                        {themes.map((themeoption) => {
                            const Icon = themeoption.icon
                            return (
                                <Button key={themeoption.name} className="hover:bg-secondary transition-all cursor-pointer duration-200" onClick={() => { setTheme(themeoption.name); setIsOpen(false); }}>

                                    <Icon className="h-5 w-5" />


                                </Button>
                            )
                        })}
                    </div>

                </div>
            )}

        </div>
    )
}
