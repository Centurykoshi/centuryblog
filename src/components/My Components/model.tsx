"use client";

import Image from "next/image";
import { useState } from "react";
import CursorImageTrail from "./CursorImageTrail";
import Link from "next/link";

type ImageDetails = {
    featuredImg: string;
    slug: string;
}






export default function Model({ ImageDetailsP }: { ImageDetailsP: ImageDetails[] }) {

    const generaterandomImages = (images: ImageDetails[], max = 5) => {

        const shuffled = [...images].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, Math.min(max, images.length));

    }

    const imagesUrls = ImageDetailsP.map(p => ({
        featuredImg: encodeURI(p.featuredImg),
        slug: p.slug
    }));

    console.log(imagesUrls);
    const randomImages = generaterandomImages(imagesUrls, 5);

    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
            <div className="flex justify-between p-4 ">
                <div className="w-full ml-10 cursor-pointer">


                    <CursorImageTrail images={randomImages}
                        frequency={40}
                        visibleFor={1.5}
                        width={180}
                        height={180}
                        radius={8}

                    />

                </div>
                <img alt="model" width={400} height={400} className="rounded-md opacity-45 hover:opacity-100 transition-opacity duration-300"
                    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}

                    src={isHovered ? "model.gif" : "modelstatic.png"}

                />



            </div>
        </>
    )
}