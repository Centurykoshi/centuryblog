"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { ChevronDown, MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";

 type Status = "PUBLISHED" | "DRAFT" | "UNPUBLISH";

type Props = {
    value: Status;
    onchange: (value: Status) => void;
}



export default function DropPublishDraft({ value, onchange }: Props) {

    const [showdialog, setshowDialog] = useState(false);

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} aria-label="Open menu" className="capitalize flex gap-1">
                        {value.toLowerCase()}
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">

                    <DropdownMenuItem onClick={() => onchange("PUBLISHED")}>
                        Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onchange("DRAFT")}>
                        Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onchange("UNPUBLISH")}>
                        Unpublish
                    </DropdownMenuItem>


                </DropdownMenuContent>

            </DropdownMenu>
        </>
    )

}