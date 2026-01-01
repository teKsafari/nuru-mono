"use client"

import { Terminal } from "lucide-react"
import { ScrollArea } from "@/components/playground/scroll-area"

interface OutputPanelProps {
  output: string
}

export function OutputPanel({ output }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
        <Terminal className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Output</span>
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
