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
import { Placeholder } from "@tiptap/extension-placeholder"

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
        <HeadingDropdownMenu levels={[2, 3, 4]} portal={isMobile} />
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
          {saveStatus === 'saved' && (
            <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />
          )}
          {saveStatus === 'error' && (
            <div className="w-2 h-2 bg-red-500 rounded-full ml-1" />
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
  const [title, setTitle] = useState<string>('')
  const [featuredImage, setFeaturedImage] = useState<string>('')
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }) // x,y as percentages
  const [isRepositioning, setIsRepositioning] = useState<boolean>(false)
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
        heading: {
          levels: [2, 3, 4], // Only allow h2, h3, h4 since h1 is the title
        },
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
      Placeholder.configure({
        placeholder: "Start writing your article content here...",
        emptyNodeClass: "is-empty",
      }),
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

  const updateDocumentMutation = useMutation(trpc.creating_page.updateDocument.mutationOptions({}));

  // we are not writing anything inside the mutation option beacuse it goes into infitie intatlization so in order to fix the problem and things
  //  work we are using useeffect hock which will be more benefiicial for us and it will remove the problem 

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;

    // here we are defining the type of t as it can recieve either ther timeout value or undefined. WHY WE ARE USING UNDEFINED CAN'T WE JUST LEAVE IT? 

    // we can't just leave it or put null or something else beacuse we are telling typescript that it can be undefined because right now it doesn't consist any value and it will be undefined when nohting is happening 

    if (updateDocumentMutation.isSuccess) {
      setSaveStatus("saved");
      t = setTimeout(() => setSaveStatus("idle"), 2000);
    } else if (updateDocumentMutation.isError) {
      setSaveStatus("error");
      t = setTimeout(() => setSaveStatus("idle"), 2000);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [
    updateDocumentMutation.isSuccess,
    updateDocumentMutation.isError,
  ]);


  // // Mutations and queries
  // const updateDocumentMutation = useMutation(
  //   trpc.creating_page.updateDocument.mutationOptions({
  //     onSuccess: () => {
  //       setSaveStatus('saved')
  //       setTimeout(() => setSaveStatus('idle'), 2000)
  //     },
  //     onError: (error) => {
  //       setSaveStatus('error')
  //       console.error('Save failed:', error)
  //       setTimeout(() => setSaveStatus('idle'), 3000)
  //     },
  //   })
  // )

  // Load document content query
  const { data: documentData } = useQuery(
    trpc.creating_page.getDocument.queryOptions(
      { slug },
      { enabled: !!slug }
    )
  );

  //enabled tells react query when to run something  so here when slug is undefined it won't run but when it is defined it will run 

  // Load content into editor when data is available
  useEffect(() => {
    if (documentData?.document && editor) {
      try {
        // Load title
        if (documentData.document.title) {
          setTitle(documentData.document.title);
        }

        // Load featured image
        if (documentData.document.featuredImg) {
          setFeaturedImage(documentData.document.featuredImg)
        }

        const querydata = documentData?.document.contentJSON;

        // Load content
        if (querydata) {
          const contentString = String(documentData.document.contentJSON);
          const content = JSON.parse(contentString)
          editor.commands.setContent(content)
          setLastSavedContent(contentString)
        }
      } catch (error) {
        console.error('Failed to parse document content:', error)
      }
    }
  }, [documentData, editor])

  // Auto-save logic - save 3 seconds after content changes
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
      autoSaveTimeoutRef.current = null
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (editor && slug) {
        const currentContent = JSON.stringify(editor.getJSON())
        const currentState = JSON.stringify({ content: currentContent, title, featuredImage, imagePosition })
        const lastState = JSON.stringify({ content: lastSavedContent, title: documentData?.document?.title || '', featuredImage: documentData?.document?.featuredImg || '', imagePosition: { x: 50, y: 50 } })

        if (currentState !== lastState && saveStatus === 'idle') {
          requestAnimationFrame(() => {
            saveDocument()
          })
        }
      }
    }, 3000)
  }, [editor, slug, title, featuredImage]) // Include title and featuredImage in deps

  // Save function
  const saveDocument = useCallback(async () => {
    if (!editor || !slug) return

    // Check status again inside the function to avoid dependency issues
    if (saveStatus === 'saving') return

    setSaveStatus('saving')

    try {
      const contentJSON = JSON.stringify(editor.getJSON())
      const contentHTML = editor.getHTML()
      // Use the dedicated title state instead of extracting from content
      const documentTitle = title.trim() || undefined;


      await updateDocumentMutation.mutateAsync({
        slug,
        title: documentTitle,
        contentJSON,
        contentHTML,
        featuredImg: featuredImage || undefined,
      })
      setLastSavedContent(contentJSON)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }, [editor, slug, updateDocumentMutation, title, featuredImage])

  // Add onUpdate to editor after initialization
  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      // Use requestAnimationFrame to prevent flushSync issues
      requestAnimationFrame(() => {
        scheduleAutoSave()
      })
    }

    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
        autoSaveTimeoutRef.current = null
      }
    }
  }, [editor, scheduleAutoSave])

  // Auto-save when title changes
  useEffect(() => {
    scheduleAutoSave()
  }, [title, scheduleAutoSave])

  // Auto-save when featured image changes
  useEffect(() => {
    scheduleAutoSave()
  }, [featuredImage, scheduleAutoSave])

  // Auto-save when image position changes
  useEffect(() => {
    scheduleAutoSave()
  }, [imagePosition, scheduleAutoSave])

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

  // Keyboard shortcut for manual save (Ctrl+S / Cmd+S) - forces immediate save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        // Cancel any pending auto-save and save immediately
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current)
          autoSaveTimeoutRef.current = null
        }
        // Use requestAnimationFrame to prevent flushSync issues
        requestAnimationFrame(() => {
          saveDocument()
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [saveDocument])

  return (
    <div className="min-h-screen min-w-screen overflow-auto flex flex-col items-center">
      <EditorContext.Provider value={{ editor }}>
        {/* Title Section */}


        {/* Featured Image Section */}
        <div className="max-w-226 w-full opacity-80 bg-secondary/20">
          {featuredImage ? (
            <div className="featured-image-container ">
              <div className="featured-image-wrapper">
                <img
                  src={featuredImage}
                  alt="Featured image"
                  className="featured-image-preview"
                  style={{
                    objectPosition: `${imagePosition.x}% ${imagePosition.y}%`
                  }}
                />

                <div className="absolute bg-secondary/10 inset-0"></div>

                {/* Remove Button (Top Right) */}
                <button
                  onClick={() => setFeaturedImage('')}
                  className="featured-image-remove"
                  title="Remove featured image"
                >
                  ✕
                </button>

                {/* Reposition Toggle (Bottom Right) */}
                <button
                  onClick={() => setIsRepositioning(!isRepositioning)}
                  className={`reposition-toggle ${isRepositioning ? 'active' : ''}`}
                  title="Adjust image position"
                >
                  <svg fill="currentColor" viewBox="0 0 20 20" className="reposition-icon">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 12V6H4v8h12z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Compact Reposition Controls */}
                {isRepositioning && (
                  <div className="compact-controls">
                    <div className="compact-control">
                      <span>H:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={imagePosition.x}
                        onChange={(e) => setImagePosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                        className="compact-slider"
                      />
                      <span>{imagePosition.x}%</span>
                    </div>

                    <div className="compact-control">
                      <span>V:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={imagePosition.y}
                        onChange={(e) => setImagePosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                        className="compact-slider"
                      />
                      <span>{imagePosition.y}%</span>
                    </div>

                    <div className="compact-presets">
                      <button
                        onClick={() => setImagePosition({ x: 50, y: 50 })}
                        className="compact-preset"
                        title="Center"
                      >
                        ●
                      </button>
                      <button
                        onClick={() => setImagePosition({ x: 50, y: 25 })}
                        className="compact-preset"
                        title="Top"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => setImagePosition({ x: 50, y: 75 })}
                        className="compact-preset"
                        title="Bottom"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="featured-image-placeholder">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setIsUploadingImage(true)
                    try {
                      // Upload directly to API
                      const formData = new FormData()
                      formData.append('file', file)

                      const response = await fetch('/api/upload-image', {
                        method: 'POST',
                        body: formData,
                      })

                      const result = await response.json()

                      if (result.success && result.url) {
                        setFeaturedImage(result.url)
                      } else {
                        console.error('Upload failed:', result.message)
                        alert('Failed to upload image: ' + result.message)
                      }
                    } catch (error) {
                      console.error('Failed to upload featured image:', error)
                      alert('Failed to upload image. Please try again.')
                    } finally {
                      setIsUploadingImage(false)
                    }
                  }
                }}
                className="featured-image-input"
                id="featured-image-upload"
              />
              <label htmlFor="featured-image-upload" className="featured-image-label">
                {isUploadingImage ? (
                  <>
                    <div className="featured-image-icon">
                      <Clock className="animate-spin w-8 h-8" />
                    </div>
                    <div className="featured-image-text">Uploading...</div>
                    <div className="featured-image-subtext">Please wait while your image is being uploaded</div>
                  </>
                ) : (
                  <>
                    <div className="featured-image-icon">📷</div>
                    <div className="featured-image-text">Add Featured Image</div>
                    <div className="featured-image-subtext">Click to upload cover image for your article</div>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        <div className=" max-w-226 w-full whitespace-normal wrap-break-word m-auto mb-2 p-2  border-b-secondary border-b-2">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your article title..."
            className="w-full border-none outline-none text-3xl font-medium text-secondary-foreground/50 resize-none overflow-hidden"
            maxLength={200}
            rows={3}
          />
        </div>

        {/* Toolbar */}
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

        {/* Content Editor */}
        <div className="simple-editor-content-wrapper">
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
            placeholder="Start writing your article content here..."
          />
        </div>
      </EditorContext.Provider>
    </div>
  )
}
