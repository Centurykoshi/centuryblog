import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { ImageWithDelete } from "./image-with-delete"

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        imageWithDelete: {
            setImageWithDelete: (options: { src: string; alt?: string; title?: string }) => ReturnType
        }
    }
}

export const ImageWithDeleteExtension = Node.create({
    name: "imageWithDelete",

    group: "block",

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: "img",
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ["img", mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageWithDelete)
    },

    addCommands() {
        return {
            setImageWithDelete:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },
})