"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailImage {
    id: number;
    position: number;
    x: number;
    y: number;
    createdAt: number;
    state: "entering" | "exiting";
}

interface CursorImageTrailProps {
    images: string[];
    frequency?: number;
    visibleFor?: number;
    width?: number;
    height?: number;
    radius?: number;
}

export default function CursorImageTrail({
    images = [],
    frequency = 35,
    visibleFor = 1,
    width = 100,
    height = 100,
    radius = 0,
}: CursorImageTrailProps) {
    const threshold = 200 - (frequency - 1) * 199 / 49;
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeImages, setActiveImages] = useState<TrailImage[]>([]);
    const componentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePos({ x, y });
    };

    useEffect(() => {
        if (isHovering && images.length > 0) {
            const lastImage = activeImages[activeImages.length - 1];
            const distance = lastImage
                ? Math.hypot(mousePos.x - lastImage.x, mousePos.y - lastImage.y)
                : Infinity;

            if (distance > threshold) {
                const newImage: TrailImage = {
                    id: Math.random(),
                    position: currentImageIndex,
                    x: mousePos.x,
                    y: mousePos.y,
                    createdAt: Date.now(),
                    state: "entering",
                };

                setActiveImages((prev) => [...prev, newImage]);
                setCurrentImageIndex((prev) => (prev + 1) % images.length);

                // Schedule exit animation
                setTimeout(() => {
                    setActiveImages((prev) =>
                        prev.map((img) =>
                            img.id === newImage.id ? { ...img, state: "exiting" } : img
                        )
                    );
                }, visibleFor * 1000);

                // Schedule removal from DOM
                setTimeout(() => {
                    setActiveImages((prev) =>
                        prev.filter((img) => img.id !== newImage.id)
                    );
                }, 10000);
            }
        }
    }, [mousePos, isHovering, images, threshold, currentImageIndex, visibleFor]);

    if (images.length === 0) {
        return <div className="text-muted-foreground">No images provided</div>;
    }

    return (
        <div
            ref={componentRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative w-full min-h-96"
        >
            <AnimatePresence>
                {activeImages.map(({ id, position, x, y, state }) => (
                    <motion.div
                        key={id}
                        initial={{
                            opacity: 0,
                            scale: 0.5,
                            filter: "blur(0px)",
                            x: x - width / 2,
                            y: y - height / 2,
                        }}
                        animate={
                            state === "entering"
                                ? {
                                    opacity: 1,
                                    scale: 1,
                                    filter: "blur(0px)",
                                    x: x - width / 2,
                                    y: y - height / 2,
                                }
                                : {
                                    opacity: 0,
                                    scale: 0.5,
                                    filter: "blur(8px)",
                                    x: x - width / 2,
                                    y: y - height / 2,
                                }
                        }
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="pointer-events-none absolute top-0 left-0 z-10"
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            backgroundImage: `url(${images[position]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: `${radius}px`,
                        }}


                    >
                        <div className="absolute inset-0 bg-primary/50 rounded-lg" />

                    </motion.div>


                ))}


            </AnimatePresence>
        </div>
    );
}
