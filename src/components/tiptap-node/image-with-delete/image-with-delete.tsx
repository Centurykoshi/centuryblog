"use client"

import React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"

import { CloseIcon } from "@/components/tiptap-icons/close-icon"
import { handleImageDelete } from "@/lib/tiptap-utils"
import "./image-with-delete.scss"
import { Button } from "@/components/ui/button"

export const ImageWithDelete: React.FC<NodeViewProps> = ({
    node,
    deleteNode,
    selected,
    updateAttributes
}) => {
    const src = node.attrs.src
    const alt = node.attrs.alt || ""
    const title = node.attrs.title || ""

    const handleDelete = async () => {
        // Call API to delete from server
        if (src && !src.startsWith('data:')) {
            await handleImageDelete(src)
        }

        // Remove from editor
        deleteNode()
    }

    return (
        <NodeViewWrapper className={`image-with-delete ${selected ? 'selected' : ''}`}>
            <div className="image-container">
                <img
                    src={src}
                    alt={alt}
                    title={title}
                    className="image-element"
                />

                <div className="image-controls">
                    <Button
                        variant={"destructive"}

                        size="sm"
                        onClick={handleDelete}
                        className="delete-button"
                        type="button"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </NodeViewWrapper>
    )
}