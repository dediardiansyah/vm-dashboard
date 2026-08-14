import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TextStyle from '@tiptap/extension-text-style'
import { Button } from './button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Heading2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useCallback } from 'react'

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: boolean
  minHeight?: string
  maxHeight?: string
  fixedHeight?: boolean
  initialHeight?: string
}

export function WysiwygEditor({ 
  value, 
  onChange, 
  placeholder, 
  disabled,
  className,
  error,
  minHeight = "2.5rem",
  maxHeight = "none",
  fixedHeight = false,
  initialHeight
}: WysiwygEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const adjustHeight = useCallback(() => {
    if (!contentRef.current || !editorRef.current || fixedHeight) return
    
    const editorHeight = editorRef.current.scrollHeight
    contentRef.current.style.height = `${Math.max(parseInt(minHeight), editorHeight)}px`
  }, [fixedHeight, minHeight])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        history: {
          depth: 100,
          newGroupDelay: 300
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-primary cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:text-muted-foreground before:h-0 before:float-left before:pointer-events-none',
      }),
      Typography,
      TextStyle
    ],
    content: value,
    editable: !disabled,
    autofocus: 'end',
    enableInputRules: true,
    enablePasteRules: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      if (!fixedHeight) {
        adjustHeight()
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
          'transition-colors duration-200',
          '[&_p]:leading-relaxed [&_p]:mb-1',
          '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2',
          '[&_ul]:list-disc [&_ul]:pl-4',
          '[&_ol]:list-decimal [&_ol]:pl-4'
        ),
      },
      handleDOMEvents: {
        keydown: (_, event) => {
          // Improve handling of Enter key
          if (event.key === 'Enter' && !event.shiftKey) {
            const selection = window.getSelection()
            if (selection?.rangeCount) {
              const range = selection.getRangeAt(0)
              const br = document.createElement('br')
              range.deleteContents()
              range.insertNode(br)
              range.setStartAfter(br)
              range.setEndAfter(br)
              selection.removeAllRanges()
              selection.addRange(range)
              event.preventDefault()
              return true
            }
          }
          return false
        }
      }
    },
  })

  useEffect(() => {
    if (editor) {
      if (fixedHeight && initialHeight) {
        if (contentRef.current) {
          contentRef.current.style.height = initialHeight
        }
      } else {
        adjustHeight()
      }
    }
  }, [editor, fixedHeight, initialHeight, adjustHeight])

  if (!editor) return null

  return (
    <div className={cn(
      "rounded-md border border-input bg-transparent",
      error && "border-red-500",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <div className="flex flex-wrap gap-2 p-1 border-b border-input bg-muted/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={cn(
            "transition-colors hover:bg-muted/80",
            editor.isActive('bold') && 'bg-muted'
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={cn(
            "transition-colors hover:bg-muted/80",
            editor.isActive('italic') && 'bg-muted'
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={cn(
            "transition-colors hover:bg-muted/80",
            editor.isActive('heading', { level: 2 }) && 'bg-muted'
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={cn(
            "transition-colors hover:bg-muted/80",
            editor.isActive('bulletList') && 'bg-muted'
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={cn(
            "transition-colors hover:bg-muted/80",
            editor.isActive('orderedList') && 'bg-muted'
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          disabled={disabled}
          className={cn(
            "transition-colors hover:bg-muted/80",
            editor.isActive('link') && 'bg-muted'
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <div 
        ref={contentRef}
        className={cn(
          "relative transition-all duration-200",
          fixedHeight ? "overflow-y-auto" : "overflow-hidden",
          "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        )}
        style={{
          minHeight: fixedHeight ? initialHeight || minHeight : minHeight,
          maxHeight: fixedHeight ? initialHeight || maxHeight : 'none',
        }}
      >
        <div ref={editorRef}>
          <EditorContent 
            editor={editor} 
            className={cn(
              "p-3",
              "[&_.ProseMirror]:min-h-[2.5rem]",
              "[&_.ProseMirror]:outline-none",
              "[&_.ProseMirror]:transition-colors",
              "[&_.ProseMirror-focused]:outline-none",
              "[&_.ProseMirror]:caret-primary"
            )}
          />
        </div>
      </div>
    </div>
  )
}