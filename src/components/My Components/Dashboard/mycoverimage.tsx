"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react"
import { file } from "zod";

export default function MyCoverImage() {

    const [image, setImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        setImage(URL.createObjectURL(file));
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    }
    return (
        <div className="flex-col items-center p-2 pt-0">

            <div className="border-2 h-48">

                {image ? (
                    <div className="relative group">
                        <img src={image} alt="Cover preview" className="w-full h-48 object-cover rounded-lg border-none " />
                    </div>
                ) : (

                    <div className="w-full h-48 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all duration-200" onClick={triggerFileInput}>

                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload Cover Image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>

                    </div>

                )}

            </div>

            <div>
                <Button>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    Add Cover
                </Button>

            </div>



        </div>
    )
}