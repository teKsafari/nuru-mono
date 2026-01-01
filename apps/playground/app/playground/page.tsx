"use client"

import { Playground } from "@/components/playground/playground"
import { goLesson1, goExecutor } from "@/components/playground/data/nuru-samples"

export default function Home() {
  return <Playground lesson={goLesson1} executor={goExecutor} />
}
