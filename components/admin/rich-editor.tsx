"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, List, ListOrdered, 
  Heading2, Undo, Redo 
} from "lucide-react";

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });
  
  if (!editor) return null;
  
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1 flex-wrap">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="bg-white min-h-[200px]"
      />
    </div>
  );
}
