"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { ImageIcon, Upload, X, RotateCcw, Type, Code, Hash, List, Quote, Link as LinkIcon, Bold, Italic, Underline } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SlashCommand {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
}

export default function MyCoverImage() {
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
    const [cursorPosition, setCursorPosition] = useState(0);
    const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        // Clean up previous image URL to prevent memory leaks
        if (image) {
            URL.revokeObjectURL(image);
        }
        setImage(URL.createObjectURL(file));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        if (image) {
            URL.revokeObjectURL(image);
            setImage(null);
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Slash commands configuration
    const slashCommands: SlashCommand[] = [
        {
            id: 'heading1',
            label: 'Heading 1',
            description: 'Large section heading',
            icon: Type,
            action: () => insertText('# ')
        },
        {
            id: 'heading2',
            label: 'Heading 2',
            description: 'Medium section heading',
            icon: Type,
            action: () => insertText('## ')
        },
        {
            id: 'heading3',
            label: 'Heading 3',
            description: 'Small section heading',
            icon: Type,
            action: () => insertText('### ')
        },
        {
            id: 'code',
            label: 'Code Block',
            description: 'Insert a code block',
            icon: Code,
            action: () => insertText('\n```\n\n```\n')
        },
        {
            id: 'inline-code',
            label: 'Inline Code',
            description: 'Inline code formatting',
            icon: Code,
            action: () => insertText('`code`')
        },
        {
            id: 'bullet-list',
            label: 'Bullet List',
            description: 'Create a bulleted list',
            icon: List,
            action: () => insertText('\n- ')
        },
        {
            id: 'numbered-list',
            label: 'Numbered List',
            description: 'Create a numbered list',
            icon: Hash,
            action: () => insertText('\n1. ')
        },
        {
            id: 'quote',
            label: 'Quote',
            description: 'Insert a quote block',
            icon: Quote,
            action: () => insertText('\n> ')
        },
        {
            id: 'link',
            label: 'Link',
            description: 'Insert a link',
            icon: LinkIcon,
            action: () => insertText('[Link text](URL)')
        },
        {
            id: 'bold',
            label: 'Bold Text',
            description: 'Make text bold',
            icon: Bold,
            action: () => insertText('**bold text**')
        },
        {
            id: 'italic',
            label: 'Italic Text',
            description: 'Make text italic',
            icon: Italic,
            action: () => insertText('*italic text*')
        },
    ];

    const insertText = (text: string) => {
        if (!contentRef.current) return;

        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = content;

        // Remove the slash and any following text that was used for filtering
        const beforeSlash = currentContent.substring(0, cursorPosition);
        const afterCursor = currentContent.substring(end);

        const newContent = beforeSlash + text + afterCursor;
        setContent(newContent);

        // Set cursor position after inserted text
        setTimeout(() => {
            if (textarea) {
                const newCursorPos = start + text.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
                textarea.focus();
            }
        }, 0);

        setShowSlashMenu(false);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;

        setContent(value);
        setCursorPosition(cursorPos);

        // Check for slash command
        const textBeforeCursor = value.substring(0, cursorPos);
        const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

        if (lastSlashIndex !== -1) {
            const textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);
            const isAtLineStart = lastSlashIndex === 0 || textBeforeCursor[lastSlashIndex - 1] === '\n';

            if (isAtLineStart && !textAfterSlash.includes(' ')) {
                // Show slash menu
                const rect = e.target.getBoundingClientRect();
                const lineHeight = 24; // Approximate line height
                const lines = textBeforeCursor.split('\n');
                const currentLine = lines.length - 1;

                setSlashMenuPosition({
                    top: rect.top + (currentLine * lineHeight) + 30,
                    left: rect.left + 20
                });

                // Filter commands based on text after slash
                const filtered = slashCommands.filter(cmd =>
                    cmd.label.toLowerCase().includes(textAfterSlash.toLowerCase()) ||
                    cmd.description.toLowerCase().includes(textAfterSlash.toLowerCase())
                );

                setFilteredCommands(filtered);
                setShowSlashMenu(true);
            } else {
                setShowSlashMenu(false);
            }
        } else {
            setShowSlashMenu(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showSlashMenu && (e.key === 'Escape')) {
            setShowSlashMenu(false);
            e.preventDefault();
        }
    };

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto relative">
            {/* Cover Image Section */}
            <div className="w-full mb-8">
                {image ? (
                    <div className="relative group">
                        <img
                            src={image}
                            alt="Cover preview"
                            className="w-full h-64 object-cover"
                        />
                        {/* Overlay controls on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-end p-4 gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={triggerFileInput}
                                className="bg-white/90 hover:bg-white text-black"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Change cover
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={removeImage}
                                className="bg-red-500/90 hover:bg-red-500"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Empty state for cover
                    <divA
                        className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all duration-200 mb-4"
                        onClick={triggerFileInput}
                    >
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Add cover image</p>
                    </div>
                )}
            </div>

            {/* Editor Content */}
            <div className="px-8 pb-8 w-full">
                {/* Title Input */}
                <input
                    ref={titleRef}
                    type="text"
                    placeholder="Untitled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-4xl font-bold border-none outline-none bg-transparent placeholder:text-muted-foreground mb-4 resize-none"
                    style={{
                        fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                    }}
                />

                {/* Content Textarea */}
                <div className="relative">
                    <textarea
                        ref={contentRef}
                        placeholder="Type '/' for commands..."
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        className="w-full min-h-[400px] text-base border-none outline-none bg-transparent placeholder:text-muted-foreground resize-none leading-7"
                        style={{
                            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                    />

                    {/* Slash Command Menu */}
                    <AnimatePresence>
                        {showSlashMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="fixed bg-background border rounded-lg shadow-lg p-2 z-50 min-w-64"
                                style={{
                                    top: slashMenuPosition.top,
                                    left: slashMenuPosition.left,
                                }}
                            >
                                <div className="text-xs text-muted-foreground mb-2 px-2">
                                    Basic blocks
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {filteredCommands.map((command) => (
                                        <motion.div
                                            key={command.id}
                                            whileHover={{ backgroundColor: "rgba(var(--accent), 0.8)" }}
                                            className="flex items-center gap-3 px-2 py-2 rounded cursor-pointer hover:bg-accent/50 transition-colors"
                                            onClick={command.action}
                                        >
                                            <div className="w-8 h-8 rounded bg-accent/50 flex items-center justify-center">
                                                <command.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{command.label}</div>
                                                <div className="text-xs text-muted-foreground">{command.description}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                {filteredCommands.length === 0 && (
                                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                        No matching commands
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                    <div className="flex gap-2">
                        {!image && (
                            <Button
                                onClick={triggerFileInput}
                                variant="outline"
                                size="sm"
                            >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Add cover
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Save Draft
                        </Button>
                        <Button size="sm">
                            Publish
                        </Button>
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}