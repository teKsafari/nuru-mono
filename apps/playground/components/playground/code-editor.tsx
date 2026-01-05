"use client"

import { useMemo } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { go } from "@codemirror/lang-go"
import { EditorView, keymap } from "@codemirror/view"
import { tags } from "@lezer/highlight"
import { createTheme } from "@uiw/codemirror-themes"

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  onFormat?: () => void
}

// Custom dark theme matching our design
const playgroundTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    backgroundImage: "",
    foreground: "#e2e8f0",
    caret: "#22d3ee",
    selection: "#334155",
    selectionMatch: "#334155",
    lineHighlight: "#1e293b",
    gutterBackground: "transparent",
    gutterForeground: "#475569",
    gutterBorder: "transparent",
  },
  styles: [
    { tag: tags.keyword, color: "#c084fc" },
    { tag: tags.string, color: "#fbbf24" },
    { tag: tags.function(tags.variableName), color: "#22d3ee" },
    { tag: tags.comment, color: "#64748b", fontStyle: "italic" },
    { tag: tags.variableName, color: "#e2e8f0" },
    { tag: tags.typeName, color: "#34d399" },
    { tag: tags.number, color: "#fb923c" },
    { tag: tags.operator, color: "#94a3b8" },
    { tag: tags.bracket, color: "#94a3b8" },
    { tag: tags.propertyName, color: "#60a5fa" },
  ],
})

// Editor base styling
const editorBaseTheme = EditorView.baseTheme({
  "&": {
    height: "100%",
    fontSize: "14px",
  },
  ".cm-scroller": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    lineHeight: "1.6",
    padding: "8px 0",
  },
  ".cm-gutters": {
    paddingRight: "8px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 8px 0 16px",
    minWidth: "40px",
  },
  ".cm-content": {
    padding: "0 16px 0 0",
  },
  ".cm-activeLine": {
    backgroundColor: "#1e293b !important",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent !important",
  },
  "&.cm-focused": {
    outline: "none",
  },
})

export function CodeEditor({ code, onChange, onFormat }: CodeEditorProps) {
  // Create keymap for format shortcut - memoized to prevent recreation on every render
  const formatKeymap = useMemo(() => {
    return onFormat ? keymap.of([
      {
        key: "Shift-Alt-f",
        run: () => {
          onFormat()
          return true
        },
      },
    ]) : []
  }, [onFormat])

  return (
    <div className="h-full overflow-hidden">
      <CodeMirror
        value={code}
        height="100%"
        theme={playgroundTheme}
        extensions={[go(), editorBaseTheme, formatKeymap]}
        onChange={(value) => onChange(value)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightSelectionMatches: true,
          searchKeymap: true,
        }}
        className="h-full [&_.cm-editor]:h-full"
      />
    </div>
  )
}
