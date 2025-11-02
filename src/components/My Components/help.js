"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const router = useRouter();
    const trpc = useTRPC();

    // Local state for editing
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch document data
    const {
        data: document,
        isLoading,
        error
    } = useQuery(
        trpc.creating_page.getDocument.queryOptions({
            slug: slug
        })
    );

    // Save document mutation
    const saveMutation = useMutation(
        trpc.creating_page.updateDocument.mutationOptions({
            onMutate: () => {
                toast.loading("Saving document...", { id: "save-doc" });
            },
            onSuccess: () => {
                toast.success("Document saved!", { id: "save-doc" });
                setHasChanges(false);
            },
            onError: (error: any) => {
                toast.error("Failed to save: " + error.message);
            }
        })
    );

    // Load document data into state
    useEffect(() => {
        if (document) {
            setTitle(document.title || "");

            // Handle contentJSON - could be string or object
            const contentValue = document.contentJSON;
            if (typeof contentValue === 'string') {
                setContent(contentValue);
            } else if (contentValue && typeof contentValue === 'object') {
                setContent(JSON.stringify(contentValue, null, 2));
            } else {
                setContent("");
            }
        }
    }, [document]);

    // Handle title changes
    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        setHasChanges(true);
    };

    // Handle content changes
    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setHasChanges(true);
    };

    // Save document
    const handleSave = () => {
        saveMutation.mutate({
            slug: slug,
            title: title,
            contentJSON: content,
            contentHTML: `<h1>${title}</h1><p>${content}</p>`
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-96">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error Loading Document</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            Could not load document with slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="w-full"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/dashboard")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Dashboard
                        </Button>

                        <span className="text-sm text-gray-500">
                            Slug: {slug} {hasChanges && "• Unsaved Changes"}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges || saveMutation.isPending}
                            size="sm"
                        >
                            {saveMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Editor */}
            <div className="max-w-4xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Debug Info */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-blue-800 text-sm">
                                📊 Document Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong>Document ID:</strong> {document?.id}
                                </div>
                                <div>
                                    <strong>Created:</strong> {document?.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                                <div>
                                    <strong>Updated:</strong> {document?.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : 'N/A'}
                                </div>
                                <div>
                                    <strong>Status:</strong> {document?.status || 'DRAFT'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Title Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📝 Title</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Enter your post title..."
                                className="w-full text-3xl font-bold border-none outline-none bg-transparent placeholder-gray-400"
                            />
                        </CardContent>
                    </Card>

                    {/* Content Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>✏️ Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={content}
                                onChange={(e) => handleContentChange(e.target.value)}
                                placeholder="Start writing your amazing content..."
                                className="w-full h-96 p-4 border rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                style={{ lineHeight: "1.6" }}
                            />

                            <div className="mt-4 text-sm text-gray-500">
                                💡 <strong>Tip:</strong> This is a simple editor. You can later integrate rich text editors like TipTap for Notion-like experience!
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>⚡ Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleContentChange(content + "\n\n## New Section\n")}
                                >
                                    Add Heading
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleContentChange(content + "\n\n- List item\n")}
                                >
                                    Add List
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleContentChange(content + "\n\n```\nCode block\n```\n")}
                                >
                                    Add Code
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}