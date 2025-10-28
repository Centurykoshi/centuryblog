import Image from "next/image";
import { useState } from "react";

export default function Model() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="flex justify-end p-4 mr-20">
            <img alt="model" width={400} height={400} className="rounded-md opacity-45 hover:opacity-100 transition-opacity duration-300"
                onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}

                src={isHovered ? "model.gif" : "modelstatic.png"}

            />



        </div>
    )
}