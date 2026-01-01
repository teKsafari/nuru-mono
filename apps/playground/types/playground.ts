import React from "react"

export interface LanguageExecutor {
  language: string
  run: (code: string) => Promise<string>
  submit: (code: string) => Promise<string>
  getSolution?: () => string
}

export interface LessonContent {
  title: string
  description: React.ReactNode
  initialCode: string
}

export interface PlaygroundProps {
  lesson: LessonContent
  executor: LanguageExecutor
  simulation?: React.ReactNode
}
