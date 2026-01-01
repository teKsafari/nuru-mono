import { LanguageExecutor, LessonContent } from "@/types/playground";
import init from "@nuru/wasm";

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
			outputReceiver: globalOutputReceiver,
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
		} catch (e) {
			return `X Kosa: ${e}`;
		}
	},
	getSolution: () => `// Programu ya kwanza - Salamu!

jina = jaza("Ingiza jina lako")

andika("Habari " + jina + "!")
`,
};

export const nuruDemo: LessonContent = {
	title: "Nuru - jifunze programu kwa Kiswahili",
	initialCode: `// Programu ya kwanza - Salamu!

jina = jaza("Ingiza jina lako")

andika("Habari " + jina + "!")
`,
	description: (
		//  maelekezo kuhusu nuru kwa lugha ya Kiswahili
		<div className="space-y-6 leading-relaxed text-muted-foreground">
			<p>
				Nuru ni lugha ya programu na mfumo wa kujifunzia ulioundwa mahsusi kwa
				ajili ya wazungumzaji wa Kiswahili. Lengo letu kuu ni kuwawezesha vijana
				kujifunza, kuunda, na kujaribu mambo mapya katika lugha wanayoizungumza
				nyumbani.
			</p>

			<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
				<p className="break-words text-sm text-muted-foreground">
					<span className="font-semibold text-foreground">Kidokezo:</span> Tumia{" "}
					<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
						andika()
					</code>{" "}
					kuona matokeo.
				</p>
			</div>
		</div>
	),
};

export const goLesson1: LessonContent = {
	title: "The Compilation Process",
	initialCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
	description: (
		<div className="space-y-6 leading-relaxed text-muted-foreground">
			<p>
				Computers need machine code, they don&apos;t understand English or even
				Go. We need to convert our high-level (Go) code into machine language,
				which is really just a set of instructions that some specific hardware
				can understand. In your case, your CPU.
			</p>

			<p>
				The Go compiler&apos;s job is to take Go code and produce machine code,
				an{" "}
				<code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
					.exe
				</code>{" "}
				file on Windows or a standard executable on Mac/Linux.
			</p>

			<div className="my-8 overflow-x-auto rounded-xl bg-background p-4 lg:p-6">
				<div className="flex min-w-0 flex-col items-center justify-center gap-4 lg:flex-row lg:gap-6">
					{/* Code Box */}
					<div className="relative w-full max-w-[200px] shrink-0">
						<div className="rounded-lg border-2 border-muted-foreground p-4">
							<p className="mb-3 text-center italic text-foreground">code</p>
							<p className="text-center font-mono text-sm">your code</p>
						</div>
					</div>

					{/* Arrow */}
					<div className="text-code-function shrink-0 rotate-90 text-2xl lg:rotate-0">
						→
					</div>

					{/* Compiler Box */}
					<div className="w-full max-w-[140px] shrink-0 rounded-lg border-2 border-primary p-4 text-center">
						<p className="mb-1 italic text-foreground">compiler</p>
						<p className="text-center font-mono text-sm">go build</p>
					</div>

					{/* Arrow */}
					<div className="text-code-function shrink-0 rotate-90 text-2xl lg:rotate-0">
						→
					</div>

					{/* Executable Box */}
					<div className="w-full max-w-[140px] shrink-0 rounded-lg border-2 border-primary p-4 text-center">
						<p className="mb-1 italic text-foreground">executable</p>
						<p className="text-center font-mono text-sm">./hello</p>
					</div>
				</div>
			</div>

			{/* Go Program Structure */}
			<h2 className="mt-8 text-xl font-bold text-foreground lg:text-2xl">
				Go Program Structure
			</h2>

			<p>
				We&apos;ll go over this all later in more detail, but to sate your
				curiosity:
			</p>

			<ol className="list-inside list-decimal space-y-4">
				<li className="break-words">
					<code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
						package main
					</code>{" "}
					lets the Go compiler know that we want this code to compile and run as
					a standalone program, as opposed to being a library that&apos;s
					imported by other programs.
				</li>
				<li className="break-words">
					<code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
						import &quot;fmt&quot;
					</code>{" "}
					imports the{" "}
					<a href="#" className="text-accent hover:underline">
						fmt (formatting) package
					</a>{" "}
					from the standard library. It allows us to use{" "}
					<code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
						fmt.Println
					</code>{" "}
					to print to the console.
				</li>
				<li className="break-words">
					<code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
						func main()
					</code>{" "}
					defines the{" "}
					<code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
						main
					</code>{" "}
					function, the entry point for a Go program.
				</li>
			</ol>

			<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
				<p className="break-words text-sm text-muted-foreground">
					<span className="font-semibold text-foreground">Tip:</span> Try to
					write code that catches errors at compile-time rather than runtime.
					The Go compiler is your friend!
				</p>
			</div>
		</div>
	),
};

export const goExecutor: LanguageExecutor = {
	language: "go",
	run: async (code) => {
		// Mock simulation delay
		await new Promise((resolve) => setTimeout(resolve, 500));
		return "Hello, World!";
	},
	submit: async (code) => {
		await new Promise((resolve) => setTimeout(resolve, 800));
		return "✓ All tests passed!";
	},
	getSolution: () => `package main

import "fmt"

func main() {
    fmt.Println("The compiled textio server is starting")
}`,
};
