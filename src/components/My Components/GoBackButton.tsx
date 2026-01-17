"use client";
import { ArrowLeft, ArrowUpIcon, Ghost } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
    value: string | null;
}

export default function GobackButton({ value }: Props) {
    return (
        <>
            <div className="realtive">



                <Link href={"/"}>
                    <Button variant={"outline"} className="text-foregournd text-sm group transition-all duration-500">

                        <ArrowLeft className="W-4 h-4 transition-transform duration-500 group-hover:rotate-360 " /> {value}

                    </Button>
                </Link>



            </div>
        </>
    )
}