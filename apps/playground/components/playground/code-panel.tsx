"use client"

import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { formatCode } from "@/lib/formatCode"

interface CodePanelProps {
  code: string
  output: string
  onCodeChange: (code: string) => void
  onRun: () => void
  onSubmit: () => void
  onShowSolution: () => void
}

export function CodePanel({ code, output, onCodeChange, onRun, onSubmit, onShowSolution }: CodePanelProps) {
  const handleFormat = () => {
    const formatted = formatCode(code)
    onCodeChange(formatted)
  }

  return (
    <div className="flex flex-col h-full bg-code-bg">
      <div className="flex items-center justify-end px-4 py-2 border-b border-border bg-card">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleFormat}
          className="h-7 px-3 text-xs"
          title="Format code (Shift+Alt+F)"
        >
          <Wand2 className="w-3 h-3 mr-1.5" />
          Format
        </Button>
      </div>
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <CodeEditor code={code} onChange={onCodeChange} onFormat={handleFormat} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <OutputPanel 
            output={output} 
            onRun={onRun} 
            onSubmit={onSubmit} 
            onShowSolution={onShowSolution} 
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
