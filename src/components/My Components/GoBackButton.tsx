"use client";
import { ArrowLeft, ArrowUpIcon, Ghost } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {
    value: string | null;
    url: string;
}

export default function GobackButton({ Prop }: { Prop: Props }) {
    return (
        <>
            <div className="realtive">



                <Link href={Prop.url} >
                    <Button variant={"outline"} className="text-foregournd text-sm group transition-all duration-500">

                        <ArrowLeft className="W-4 h-4 transition-transform duration-500 group-hover:rotate-360 " /> {Prop.value}

                    </Button>
                </Link>



            </div>
        </>
    )
}