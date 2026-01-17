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

interface AnimationConfig {
  opacity: number;
  scale: number;
  blur: number;
  is3D: "2D" | "3D";
  rotate2D: number;
  rotate3D: { x: number; y: number; z: number };
}

interface CursorImageTrailProps {
  images?: string[];
  frequency?: number;
  visibleFor?: number;
  width?: number;
  height?: number;
  radius?: number;
  fit?: "fill" | "fit";
  perspective?: {
    enabled: boolean;
    value: number;
  };
  animation?: {
    in: {
      from: AnimationConfig;
      to: AnimationConfig;
      transition: any;
    };
    out: AnimationConfig & { transition: any };
  };
}

// Custom hook for preloading images
function useImagePreloader(imageUrls: string[]): boolean {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preloadImages = async () => {
      const imagePromises = imageUrls.map(
        (url) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
          })
      );

      try {
        await Promise.all(imagePromises);
        if (isMounted) {
          setImagesPreloaded(true);
        }
      } catch (error) {
        console.error("Failed to preload images:", error);
      }
    };

    if (imageUrls.length > 0) {
      preloadImages();
    }

    return () => {
      isMounted = false;
    };
  }, [imageUrls]);

  return imagesPreloaded;
}

export default function CursorImageTrail1({
  images = [],
  frequency = 50,
  visibleFor = 1,
  width = 100,
  height = 100,
  radius = 0,
  fit = "fill",
  perspective = { enabled: false, value: 1000 },
  animation = {
    in: {
      from: {
        opacity: 0,
        scale: 0.5,
        blur: 8,
        is3D: "2D" as const,
        rotate2D: 0,
        rotate3D: { x: 0, y: 0, z: 0 },
      },
      to: {
        opacity: 1,
        scale: 1,
        blur: 0,
        is3D: "2D" as const,
        rotate2D: 0,
        rotate3D: { x: 0, y: 0, z: 0 },
      },
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    out: {
      opacity: 0,
      scale: 0.5,
      blur: 8,
      is3D: "2D" as const,
      rotate2D: 0,
      rotate3D: { x: 0, y: 0, z: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  },
}: CursorImageTrailProps) {
  const threshold = 200 - ((frequency - 1) * 199) / 49;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImages, setActiveImages] = useState<TrailImage[]>([]);
  const [isInViewport, setIsInViewport] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const imagesPreloaded = useImagePreloader(isInViewport ? images : []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
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
          setActiveImages((prev) => prev.filter((img) => img.id !== newImage.id));
        }, 10000); // 10 seconds
      }
    }
  }, [mousePos, isHovering, images, threshold, currentImageIndex, visibleFor, activeImages]);

  if (images.length === 0) {
    return (
      <div className="text-muted-foreground text-center p-4">
        Add images to the component
      </div>
    );
  }

  return (
    <div
      ref={componentRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-96"
    >
      {imagesPreloaded && (
        <AnimatePresence>
          {activeImages.map(({ id, position, x, y, state }) => (
            <motion.div
              key={id}
              initial={{
                opacity: animation.in.from.opacity,
                scale: animation.in.from.scale,
                filter: `blur(${animation.in.from.blur}px)`,
                x: x - width / 2,
                y: y - height / 2,
                rotate:
                  animation.in.from.is3D === "2D"
                    ? animation.in.from.rotate2D
                    : 0,
                rotateX:
                  animation.in.from.is3D === "3D"
                    ? animation.in.from.rotate3D.x
                    : 0,
                rotateY:
                  animation.in.from.is3D === "3D"
                    ? animation.in.from.rotate3D.y
                    : 0,
                rotateZ:
                  animation.in.from.is3D === "3D"
                    ? animation.in.from.rotate3D.z
                    : 0,
              }}
              animate={
                state === "entering"
                  ? {
                      opacity: animation.in.to.opacity,
                      scale: animation.in.to.scale,
                      filter: `blur(${animation.in.to.blur}px)`,
                      x: x - width / 2,
                      y: y - height / 2,
                      rotate:
                        animation.in.to.is3D === "2D"
                          ? animation.in.to.rotate2D
                          : 0,
                      rotateX:
                        animation.in.to.is3D === "3D"
                          ? animation.in.to.rotate3D.x
                          : 0,
                      rotateY:
                        animation.in.to.is3D === "3D"
                          ? animation.in.to.rotate3D.y
                          : 0,
                      rotateZ:
                        animation.in.to.is3D === "3D"
                          ? animation.in.to.rotate3D.z
                          : 0,
                    }
                  : {
                      opacity: animation.out.opacity,
                      scale: animation.out.scale,
                      filter: `blur(${animation.out.blur}px)`,
                      x: x - width / 2,
                      y: y - height / 2,
                      rotate:
                        animation.out.is3D === "2D" ? animation.out.rotate2D : 0,
                      rotateX:
                        animation.out.is3D === "3D"
                          ? animation.out.rotate3D.x
                          : 0,
                      rotateY:
                        animation.out.is3D === "3D"
                          ? animation.out.rotate3D.y
                          : 0,
                      rotateZ:
                        animation.out.is3D === "3D"
                          ? animation.out.rotate3D.z
                          : 0,
                    }
              }
              transition={
                state === "entering"
                  ? animation.in.transition
                  : animation.out.transition
              }
              className="pointer-events-none absolute top-0 left-0 z-10"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url(${images[position] ?? ""})`,
                backgroundSize: fit === "fill" ? "cover" : "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: `${radius}px`,
                perspective: perspective.enabled
                  ? `${perspective.value}px`
                  : "none",
              }}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
