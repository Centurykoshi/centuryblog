"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { useParams } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import { extractFirstHeading, Extractfirstimage } from "@/utils/extract-title-image"
import { useMutation, useQuery } from "@tanstack/react-query"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { ImageWithDeleteExtension } from "@/components/tiptap-node/image-with-delete"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/image-with-delete/image-with-delete.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"
import { Save, Clock } from "lucide-react"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, handleImageDelete, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onSave,
  saveStatus,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
  onSave: () => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          data-style="ghost"
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          title={saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
        >
          {saveStatus === 'saving' ? (
            <Clock className="tiptap-button-icon animate-spin" />
          ) : (
            <Save className="tiptap-button-icon" />
          )}
          {!isMobile && (
            <span className="ml-1">
              {saveStatus === 'saved' ? 'Saved' :
                saveStatus === 'saving' ? 'Saving...' :
                  saveStatus === 'error' ? 'Error' : 'Save'}
            </span>
          )}
        </Button>
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const slug = params?.slug as string

  // Save states
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSavedContent, setLastSavedContent] = useState<string>('')
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize editor first
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ImageWithDeleteExtension,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        type: "imageWithDelete",
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 10,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content,
  })

  // tRPC client
  const trpc = useTRPC()

  // Mutations and queries
  const updateDocumentMutation = useMutation(trpc.creating_page.updateDocument.mutationOptions({
    onSuccess: () => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    },
    onError: (error) => {
      setSaveStatus('error')
      console.error('Save failed:', error)
      setTimeout(() => setSaveStatus('idle'), 3000)
    },
  }))

  // Load document content query
  const { data: documentData } = useQuery(
    trpc.creating_page.getDocument.queryOptions(
      { slug },
      { enabled: !!slug }
    )
  )

  // Load content into editor when data is available
  useEffect(() => {
    if (documentData?.document?.contentJSON && editor) {
      try {
        const content = JSON.parse(documentData.document.contentJSON)
        editor.commands.setContent(content)
        setLastSavedContent(documentData.document.contentJSON)
      } catch (error) {
        console.error('Failed to parse document content:', error)
      }
    }
  }, [documentData, editor])

  // Auto-save logic
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (editor && slug) {
        const currentContent = JSON.stringify(editor.getJSON())
        if (currentContent !== lastSavedContent) {
          saveDocument()
        }
      }
    }, 60000) // Auto-save every 1 minute
  }, [editor, slug, lastSavedContent]) // Remove saveDocument from deps to avoid circular dependency

  // Save function
  const saveDocument = useCallback(async () => {
    if (!editor || !slug || saveStatus === 'saving') return

    setSaveStatus('saving')

    const contentJSON = JSON.stringify(editor.getJSON())
    const contentHTML = editor.getHTML()
    const firstHeading = extractFirstHeading(editor)
    const firstImage = Extractfirstimage(editor)

    try {
      await updateDocumentMutation.mutateAsync({
        slug,
        title: firstHeading || "Untitled",
        contentJSON,
        contentHTML,
        featuredImg: firstImage || undefined,
      })
      setLastSavedContent(contentJSON)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }, [editor, slug, updateDocumentMutation, saveStatus])

  // Add onUpdate to editor after initialization
  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        scheduleAutoSave()
      }

      editor.on('update', handleUpdate)
      return () => editor.off('update', handleUpdate)
    }
  }, [editor, scheduleAutoSave])

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  // Keyboard shortcut for manual save (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveDocument()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [saveDocument])

  return (
    <div className="simple-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              onSave={saveDocument}
              saveStatus={saveStatus}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}
