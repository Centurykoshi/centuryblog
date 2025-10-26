"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function Frontpage() {

    const [activeLink, setActiveLink] = useState<string | null>(null);

    const links = [
        { name: "Projects", href: "/projects" },
        { name: "Art", href: "/art" },
        { name: "About Me", href: "/aboutme" }
    ]




    return (
        <div className="flex justify-center p-4">
            <div className="max-w-5xl w-full justify-between flex mt-4">
                <div className="text-2xl cursor-pointer bg-red-500">
                    Piyush Yadav

                </div>
                <div className="flex gap-4">
                    {links.map(link => (
                        <Link key={link.name} href={link.href} onClick={() => setActiveLink(link.name)}
                            className={cn(
                                "text-2xl hover:text-secondary-foreground", activeLink === link.name ? "text-muted-foreground" : "text-primary"
                            )}>
                            {link.name}

                        </Link>
                    ))}

                </div>
            </div>
        </div>
    )
}