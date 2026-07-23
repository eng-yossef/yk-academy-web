"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function ToolbarButton({ icon, label, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        active
          ? "bg-electric-blue/10 text-electric-blue"
          : "text-navy/60 hover:bg-light-gray hover:text-navy"
      )}
    >
      {icon}
    </button>
  );
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
  minHeight = 200,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeStates, setActiveStates] = React.useState<Record<string, boolean>>({});

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveStates();
  };

  const updateActiveStates = () => {
    setActiveStates({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  React.useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-light-gray bg-white", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-light-gray bg-light-gray/30 p-2">
        <ToolbarButton
          icon={<Bold className="h-4 w-4" />}
          label="Bold"
          active={activeStates.bold}
          onClick={() => execCommand("bold")}
        />
        <ToolbarButton
          icon={<Italic className="h-4 w-4" />}
          label="Italic"
          active={activeStates.italic}
          onClick={() => execCommand("italic")}
        />
        <ToolbarButton
          icon={<Underline className="h-4 w-4" />}
          label="Underline"
          active={activeStates.underline}
          onClick={() => execCommand("underline")}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          icon={<Heading1 className="h-4 w-4" />}
          label="Heading 1"
          onClick={() => execCommand("formatBlock", "h1")}
        />
        <ToolbarButton
          icon={<Heading2 className="h-4 w-4" />}
          label="Heading 2"
          onClick={() => execCommand("formatBlock", "h2")}
        />
        <ToolbarButton
          icon={<Heading3 className="h-4 w-4" />}
          label="Heading 3"
          onClick={() => execCommand("formatBlock", "h3")}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          icon={<List className="h-4 w-4" />}
          label="Bullet List"
          active={activeStates.insertUnorderedList}
          onClick={() => execCommand("insertUnorderedList")}
        />
        <ToolbarButton
          icon={<ListOrdered className="h-4 w-4" />}
          label="Numbered List"
          active={activeStates.insertOrderedList}
          onClick={() => execCommand("insertOrderedList")}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          icon={<AlignLeft className="h-4 w-4" />}
          label="Align Left"
          onClick={() => execCommand("justifyLeft")}
        />
        <ToolbarButton
          icon={<AlignCenter className="h-4 w-4" />}
          label="Align Center"
          onClick={() => execCommand("justifyCenter")}
        />
        <ToolbarButton
          icon={<AlignRight className="h-4 w-4" />}
          label="Align Right"
          onClick={() => execCommand("justifyRight")}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          icon={<Undo className="h-4 w-4" />}
          label="Undo"
          onClick={() => execCommand("undo")}
        />
        <ToolbarButton
          icon={<Redo className="h-4 w-4" />}
          label="Redo"
          onClick={() => execCommand("redo")}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onMouseUp={updateActiveStates}
        onKeyUp={updateActiveStates}
        data-placeholder={placeholder}
        className="prose prose-sm max-w-none p-4 text-sm text-foreground focus:outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
        suppressContentEditableWarning
      />
    </div>
  );
}
