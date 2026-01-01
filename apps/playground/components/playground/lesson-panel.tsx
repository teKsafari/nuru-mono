"use client"

import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/playground/scroll-area"

export function LessonPanel() {
  return (
    <ScrollArea className="h-full w-full bg-card">
      <div className="p-6 lg:p-8 w-full min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">The Compilation Process</h1>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Computers need machine code, they don&apos;t understand English or even Go. We need to convert our
            high-level (Go) code into machine language, which is really just a set of instructions that some specific
            hardware can understand. In your case, your CPU.
          </p>

          <p>
            The Go compiler&apos;s job is to take Go code and produce machine code, an{" "}
            <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">.exe</code> file on
            Windows or a standard executable on Mac/Linux.
          </p>

          <div className="bg-background rounded-xl p-4 lg:p-6 my-8 overflow-x-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 min-w-0">
              {/* Code Box */}
              <div className="relative shrink-0 w-full max-w-[200px]">
                <div className="border-2 border-muted-foreground rounded-lg p-4">
                  <p className="text-center italic text-foreground mb-3">code</p>
                  <p className="text-center font-mono text-sm">your code</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-code-function text-2xl rotate-90 lg:rotate-0 shrink-0">→</div>

              {/* Compiler Box */}
              <div className="border-2 border-primary rounded-lg p-4 w-full max-w-[140px] text-center shrink-0">
                <p className="italic text-foreground mb-1">compiler</p>
                <p className="text-center font-mono text-sm">go build</p>
              </div>

              {/* Arrow */}
              <div className="text-code-function text-2xl rotate-90 lg:rotate-0 shrink-0">→</div>

              {/* Executable Box */}
              <div className="border-2 border-primary rounded-lg p-4 w-full max-w-[140px] text-center shrink-0">
                <p className="italic text-foreground mb-1">executable</p>
                <p className="text-center font-mono text-sm">./hello</p>
              </div>
            </div>
          </div>

          {/* Go Program Structure */}
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mt-8">Go Program Structure</h2>

          <p>We&apos;ll go over this all later in more detail, but to sate your curiosity:</p>

          <ol className="space-y-4 list-decimal list-inside">
            <li className="break-words">
              <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">package main</code>{" "}
              lets the Go compiler know that we want this code to compile and run as a standalone program, as opposed to
              being a library that&apos;s imported by other programs.
            </li>
            <li className="break-words">
              <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">
                import &quot;fmt&quot;
              </code>{" "}
              imports the{" "}
              <a href="#" className="text-accent hover:underline">
                fmt (formatting) package
              </a>{" "}
              from the standard library. It allows us to use{" "}
              <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">fmt.Println</code>{" "}
              to print to the console.
            </li>
            <li className="break-words">
              <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">func main()</code>{" "}
              defines the{" "}
              <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">main</code>{" "}
              function, the entry point for a Go program.
            </li>
          </ol>

          <div className="bg-secondary/50 rounded-lg p-4 mt-6 border border-border">
            <p className="text-sm text-muted-foreground break-words">
              <span className="font-semibold text-foreground">Tip:</span> Try to write code that catches errors at
              compile-time rather than runtime. The Go compiler is your friend!
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
