"use client"

import { Play, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable"

interface CodePanelProps {
  code: string
  output: string
  onCodeChange: (code: string) => void
  onRun: () => void
  onSubmit: () => void
  onShowSolution: () => void
}

export function CodePanel({ code, output, onCodeChange, onRun, onSubmit, onShowSolution }: CodePanelProps) {
  return (
    <div className="flex flex-col h-full bg-code-bg">
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <CodeEditor code={code} onChange={onCodeChange} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <OutputPanel output={output} />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 p-4 bg-card border-t border-border">
        <Button onClick={onSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Send className="w-4 h-4 mr-2" />
          Submit
        </Button>
        <Button variant="secondary" onClick={onRun}>
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        <Button variant="outline" onClick={onShowSolution}>
          <Eye className="w-4 h-4 mr-2" />
          Solution
        </Button>
      </div>
    </div>
  )
}
