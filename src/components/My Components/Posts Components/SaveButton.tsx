"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type Status = "PUBLISHED" | "DRAFT" | "UNPUBLISH";

type Savebuttonprops = {
    value: Status; // It means user has selected the value like draft publish but hasn't clicked on the save button yet 
    savedValue: Status; // The Selected value is saved why do we need boht of them ? To let know save button if we lave publish but don't click on save button 

    onSave: (value: Status) => Promise<void>;
    isSaving?: boolean;
    label?: string;
};

export default function SaveButtonPublish({
    value,
    savedValue,
    onSave,
    isSaving = false,
    label = "Save",

}: Savebuttonprops) {
    const hasChanges = value !== savedValue;

    return (
        <Button size={"sm"} disabled={!hasChanges || isSaving} onClick={() => onSave(value)} className="flex gap-1 ">
            <Save className="w-4 h-4" />
            {label}

        </Button>
    )

}
