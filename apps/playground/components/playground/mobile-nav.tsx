"use client"

import { BookOpen, Code2, Workflow } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  activeTab: "lesson" | "code" | "simulation"
  onTabChange: (tab: "lesson" | "code" | "simulation") => void
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="flex items-center gap-1 p-2 bg-card border-b border-border">
      <button
        onClick={() => onTabChange("lesson")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
          activeTab === "lesson"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <BookOpen className="w-4 h-4" />
        Lesson
      </button>
      <button
        onClick={() => onTabChange("code")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
          activeTab === "code"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <Code2 className="w-4 h-4" />
        Code
      </button>
      <button
        onClick={() => onTabChange("simulation")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
          activeTab === "simulation"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <Workflow className="w-4 h-4" />
        Simulation
      </button>
    </nav>
  )
}
