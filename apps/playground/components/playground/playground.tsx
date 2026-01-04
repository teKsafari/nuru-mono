"use client"

import { useState } from "react"
import { LessonPanel } from "./lesson-panel"
import { CodePanel } from "./code-panel"
import { SimulationPanel } from "./simulation-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "./mobile-nav"
import { PlaygroundProps } from "@/types/playground"

export function Playground({ lesson, executor, simulation }: PlaygroundProps) {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<"lesson" | "code" | "simulation">("lesson")
  const [code, setCode] = useState(lesson.initialCode)
  const [output, setOutput] = useState("")

  const handleRun = async () => {
    setOutput("Running...")
    try {
      const result = await executor.run(code)
      setOutput(result)
    } catch (error) {
      setOutput(`Error: ${error}`)
    }
  }

  const handleSubmit = async () => {
    setOutput("Testing...")
    try {
      const result = await executor.submit(code)
      setOutput(result)
    } catch (error) {
      setOutput(`Error: ${error}`)
    }
  }

  const handleShowSolution = () => {
    if (executor.getSolution) {
      setCode(executor.getSolution())
    }
  }

  if (isMobile) {
    return (
      <div className="max-h-full flex flex-col flex-1 bg-background">
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-hidden">
          {activeTab === "lesson" ? (
            <LessonPanel lesson={lesson} />
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
            simulation ? (
              <SimulationPanel nodes={[]} edges={[]} content={simulation} />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-green-500">No simulation available</p>
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-full flex-1 bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={35} minSize={20}>
          <LessonPanel lesson={lesson} />
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
          <SimulationPanel nodes={[]} edges={[]} content={simulation} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
