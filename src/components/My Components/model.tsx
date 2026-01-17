"use client";

import Image from "next/image";
import { useState } from "react";
import CursorImageTrail from "./CursorImageTrail";



export default function Model() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
            <div className="flex justify-between p-4 ">
                <div className="w-full ml-10 cursor-pointer">

                    <CursorImageTrail images={[
                        "/uploads/images/1768150526284-Mental%20health-amico.png",
                        "/uploads/images/1767373335274-fae6016c9992102374bbcf35c9f14912.jpg",
                        "/uploads/images/1767373717379-0aeb9147434c042e1439c4c65761d631.jpg",
                        "/uploads/images/1768161046172-Mental%20health-bro%20(1).png",
                        "/uploads/images/1768666762552-sitepage1.png",
                    ]}
                        frequency={40}
                        visibleFor={1.5}
                        width={180}
                        height={180}
                        radius={8} />
                </div>
                <img alt="model" width={400} height={400} className="rounded-md opacity-45 hover:opacity-100 transition-opacity duration-300"
                    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}

                    src={isHovered ? "model.gif" : "modelstatic.png"}

                />



            </div>
        </>
    )
}