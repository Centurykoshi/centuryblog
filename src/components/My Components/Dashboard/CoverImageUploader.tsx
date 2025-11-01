"use client";

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    ImageIcon,
    Upload,
    X,
    Move,
    RotateCcw,
    Settings,
    Trash2,
    Link,
    Palette
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface CoverImageUploaderProps {
    onImageChange?: (imageUrl: string | null) => void;
    initialImage?: string;
}

export default function CoverImageUploader({
    onImageChange,
    initialImage
}: CoverImageUploaderProps) {
    const [coverImage, setCoverImage] = useState<string | null>(initialImage || null);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // Percentage position
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [isAdjusting, setIsAdjusting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Predefined cover colors/gradients
    const coverOptions = [
        { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: 'Purple Blue' },
        { type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', name: 'Pink Red' },
        { type: 'gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: 'Blue Cyan' },
        { type: 'gradient', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', name: 'Green Mint' },
        { type: 'gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', name: 'Pink Yellow' },
        { type: 'color', value: '#2563eb', name: 'Blue' },
        { type: 'color', value: '#dc2626', name: 'Red' },
        { type: 'color', value: '#16a34a', name: 'Green' },
        { type: 'color', value: '#ca8a04', name: 'Yellow' },
        { type: 'color', value: '#9333ea', name: 'Purple' },
    ];

    const handleFileUpload = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setCoverImage(result);
                onImageChange?.(result);
                setImagePosition({ x: 50, y: 50 }); // Reset position for new image
            };
            reader.readAsDataURL(file);
        }
    }, [onImageChange]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }, [handleFileUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            setCoverImage(urlInput.trim());
            onImageChange?.(urlInput.trim());
            setUrlInput('');
            setShowUrlInput(false);
            setImagePosition({ x: 50, y: 50 });
        }
    };

    const handleCoverOption = (option: typeof coverOptions[0]) => {
        setCoverImage(option.value);
        onImageChange?.(option.value);
        setImagePosition({ x: 50, y: 50 });
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        onImageChange?.(null);
        setImagePosition({ x: 50, y: 50 });
    };

    const handleImageAdjust = (e: React.MouseEvent) => {
        if (!isAdjusting || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setImagePosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        });
    };

    const isGradientOrColor = coverImage && (
        coverImage.startsWith('linear-gradient') ||
        coverImage.startsWith('#') ||
        coverImage.startsWith('rgb')
    );

    return (
        <div className="relative w-full">
            <AnimatePresence mode="wait">
                {coverImage ? (
                    <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 240 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative w-full h-60 overflow-hidden cursor-pointer group"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => {
                            setIsHovering(false);
                            setIsAdjusting(false);
                        }}
                        onMouseMove={handleImageAdjust}
                        onMouseDown={() => isHovering && setIsAdjusting(true)}
                        onMouseUp={() => setIsAdjusting(false)}
                    >
                        {/* Cover Image/Background */}
                        {isGradientOrColor ? (
                            <div
                                className="w-full h-full"
                                style={{ background: coverImage }}
                            />
                        ) : (
                            <motion.img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover transition-all duration-200"
                                style={{
                                    objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                                    cursor: isAdjusting ? 'grabbing' : 'grab'
                                }}
                                draggable={false}
                            />
                        )}

                        {/* Overlay Controls */}
                        <AnimatePresence>
                            {isHovering && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/20 flex items-end justify-end p-4 gap-2"
                                >
                                    {!isGradientOrColor && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-white/90 hover:bg-white text-black"
                                            onClick={() => setIsAdjusting(!isAdjusting)}
                                        >
                                            <Move className="h-4 w-4 mr-1" />
                                            {isAdjusting ? 'Done' : 'Reposition'}
                                        </Button>
                                    )}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="bg-white/90 hover:bg-white text-black"
                                            >
                                                <Settings className="h-4 w-4 mr-1" />
                                                Change
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload Image
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setShowUrlInput(true)}>
                                                <Link className="h-4 w-4 mr-2" />
                                                Link to Image
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <div className="px-2 py-1">
                                                <p className="text-xs font-medium text-muted-foreground mb-2">Colors & Gradients</p>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {coverOptions.map((option, index) => (
                                                        <button
                                                            key={index}
                                                            className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                                                            style={{ background: option.value }}
                                                            onClick={() => handleCoverOption(option)}
                                                            title={option.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={removeCoverImage} className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove Cover
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Position Indicator */}
                        {isAdjusting && !isGradientOrColor && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium"
                            >
                                Drag to reposition
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    // Add Cover Button
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full group"
                    >
                        <div
                            className={`
                w-full h-32 border-2 border-dashed border-border rounded-lg
                flex flex-col items-center justify-center gap-3
                hover:border-primary/50 hover:bg-accent/30 transition-all duration-200
                ${isDragging ? 'border-primary bg-primary/10' : ''}
                cursor-pointer
              `}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-foreground">Add a cover image</p>
                                    <p className="text-xs text-muted-foreground">
                                        Upload or drag an image, or choose from templates
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Quick Actions on Hover */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUrlInput(true);
                                }}
                            >
                                <Link className="h-4 w-4 mr-1" />
                                Link
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                                        <Palette className="h-4 w-4 mr-1" />
                                        Gallery
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Colors & Gradients</p>
                                        <div className="grid grid-cols-5 gap-2">
                                            {coverOptions.map((option, index) => (
                                                <button
                                                    key={index}
                                                    className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                                                    style={{ background: option.value }}
                                                    onClick={() => handleCoverOption(option)}
                                                    title={option.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* URL Input Modal */}
            <AnimatePresence>
                {showUrlInput && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowUrlInput(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-background border rounded-lg p-6 w-full max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold mb-4">Add image URL</h3>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Paste image URL..."
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                    autoFocus
                                />
                                <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button variant="outline" onClick={() => setShowUrlInput(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />
        </div>
    );
}