"use client"

import { useState } from "react"
import { LessonPanel } from "./lesson-panel"
import { CodePanel } from "./code-panel"
import { SimulationPanel } from "./simulation-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable"
// import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "./mobile-nav"

export function Playground() {
  const isMobile = true
  const [activeTab, setActiveTab] = useState<"lesson" | "code" | "simulation">("lesson")
  const [code, setCode] = useState(`package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`)
  const [output, setOutput] = useState("")

  const handleRun = () => {
    setOutput("Hello, World!")
  }

  const handleSubmit = () => {
    setOutput("✓ All tests passed!")
  }

  const handleShowSolution = () => {
    setCode(`package main

import "fmt"

func main() {
    fmt.Println("The compiled textio server is starting")
}`)
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-hidden">
          {activeTab === "lesson" ? (
            <LessonPanel />
          ) : activeTab === "code" ? (
            <CodePanel
              code={code}
              output={output}
              onCodeChange={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onShowSolution={handleShowSolution}
            />
          ) : (
            <SimulationPanel />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={35} minSize={20}>
          <LessonPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={25}>
          <CodePanel
            code={code}
            output={output}
            onCodeChange={setCode}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onShowSolution={handleShowSolution}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <SimulationPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
