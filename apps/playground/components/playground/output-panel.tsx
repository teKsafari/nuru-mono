"use client"

import { Play, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/playground/scroll-area"

interface OutputPanelProps {
  output: string
  onRun: () => void
  onSubmit: () => void
  onShowSolution: () => void
}

export function OutputPanel({ output, onRun, onSubmit, onShowSolution }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
        <Button onClick={onSubmit} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 px-3 text-xs">
          <Send className="w-3 h-3 mr-1.5" />
          Submit
        </Button>
        <Button variant="secondary" size="sm" onClick={onRun} className="h-7 px-3 text-xs">
          <Play className="w-3 h-3 mr-1.5" />
          Run
        </Button>
        <Button variant="secondary" size="sm" onClick={onShowSolution} className="h-7 px-3 text-xs">
          <Eye className="w-3 h-3 mr-1.5" />
          Solution
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {output ? (
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-sm text-muted-foreground italic">Run your code to see output here...</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
