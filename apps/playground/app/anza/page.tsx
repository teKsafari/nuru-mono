"use client"

import { Playground } from "@/components/playground/playground"
import { goLesson1, goExecutor, nuruDemo, nuruExecutor } from "@/app/anza/nuru-samples"

export default function Home() {
  return <Playground lesson={nuruDemo} executor={nuruExecutor} />
}
