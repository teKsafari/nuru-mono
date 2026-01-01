import { LanguageExecutor, LessonContent } from "@/types/playground"
import init from '@nuru/wasm';

// Singleton to hold the WASM instance and output handler
let nuruInstance: any = null;
let currentOutputHandler: ((text: string) => void) | null = null;

// Global output receiver for WASM init
function globalOutputReceiver(text: string, isError: boolean) {
  if (currentOutputHandler) {
    // Basic formatting: newlines are handled by caller or pre-formatted
    // The previous Svelte code appended <br/>, but our OutputPanel uses <pre>,
    // so raw newlines are better.
    // However, if the text comes without newlines, we might need to add them.
    // The Svelte code: output += newOutput + '<br/>';
    // Let's assume for now we just pass raw text and append a newline if needed.
    const formattedText = isError ? `Error: ${text}\n` : `${text}\n`;
    currentOutputHandler(formattedText);
  }
}

async function getNuru() {
  if (!nuruInstance) {
    nuruInstance = await init({
      outputReceiver: globalOutputReceiver
    });
  }
  return nuruInstance;
}

export const nuruExecutor: LanguageExecutor = {
  language: "Nuru",
  run: async (code) => {
    const nuru = await getNuru();
    let outputBuffer = "";
    
    // Set handler to capture this run's output
    currentOutputHandler = (text) => {
      outputBuffer += text;
    };

    try {
      await nuru.execute(code);
    } catch (e) {
      outputBuffer += `\nExecution Error: ${e}`;
    } finally {
      // Cleanup handler
      currentOutputHandler = null;
    }

    return outputBuffer;
  },
  submit: async (code) => {
    // For now, submit just runs the code and checks if it runs without error
    const nuru = await getNuru();
    let outputBuffer = "";
     currentOutputHandler = (text) => {
      outputBuffer += text;
    };
    try {
       await nuru.execute(code);
       return "✓ Imetebet! (Success)";
    } catch(e) {
      return `X Kosa: ${e}`;
    }
  },
  getSolution: () => `chombo = "Tanzania"

andika("Habari " + chombo + "!")`
}

export const nuruDemo: LessonContent ={
  title: "Nuru - jifunze programu kwa Kiswahili",
  initialCode: `chombo = "Tanzania"

andika("Habari " + chombo + "!")
`,
description: (
  //  maelekezo kuhusu nuru kwa lugha ya Kiswahili
  <div className="space-y-6 text-muted-foreground leading-relaxed">
    <p>
      Nuru ni lugha ya programu na mfumo wa kujifunzia ulioundwa mahsusi kwa ajili ya wazungumzaji wa Kiswahili. Lengo letu kuu ni kuwawezesha vijana kujifunza, kuunda, na kujaribu mambo mapya katika lugha wanayoizungumza nyumbani.
    </p>

    <div className="bg-secondary/50 rounded-lg p-4 mt-6 border border-border">
      <p className="text-sm text-muted-foreground break-words">
        <span className="font-semibold text-foreground">Kidokezo:</span> Tumia <code className="px-1 py-0.5 bg-background rounded text-xs font-mono">andika()</code> kuona matokeo.
      </p>
    </div>
  </div>
)
}



export const goLesson1: LessonContent = {
  title: "The Compilation Process",
  initialCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  description: (
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
  )
}

export const goExecutor: LanguageExecutor = {
  language: "go",
  run: async (code) => {
    // Mock simulation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return "Hello, World!";
  },
  submit: async (code) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return "✓ All tests passed!";
  },
  getSolution: () => `package main

import "fmt"

func main() {
    fmt.Println("The compiled textio server is starting")
}`
}
