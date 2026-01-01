"use client"

import { ScrollArea } from "@/components/playground/scroll-area"
import { LessonContent } from "@/types/playground"

interface LessonPanelProps {
  lesson: LessonContent
}

export function LessonPanel({ lesson }: LessonPanelProps) {
  return (
    <ScrollArea className="h-full w-full bg-card">
      <div className="p-6 lg:p-8 w-full min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{lesson.title}</h1>
        </div>

        {lesson.description}
      </div>
    </ScrollArea>
  )
}
