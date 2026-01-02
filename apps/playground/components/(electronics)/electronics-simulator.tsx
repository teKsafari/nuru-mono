"use client";

import { useState, useRef, useEffect } from "react";
import TerminalComponent from "./terminal-component";
import CodeEditorComponent from "./code-editor-component";
import ElectronicsDisplayComponent from "./electronics-display-component";

type ComponentState = {
	active: boolean;
	type: "led" | "buzzer" | "motor";
	color?: string;
};

type ProgramState = "idle" | "running" | "paused";

export default function ElectronicsSimulator() {
	const [components, setComponents] = useState<ComponentState[]>([
		{ active: false, type: "led", color: "red" }, // Component 1: Red LED
		{ active: false, type: "led", color: "green" }, // Component 2: Green LED
		{ active: false, type: "led", color: "blue" }, // Component 3: Blue LED
		{ active: false, type: "buzzer" }, // Component 4: Buzzer
		{ active: false, type: "motor" }, // Component 5: Motor
	]);

	// Msimbo wa programu

	const exampleCode = `// Mfano: Washa na Zima LED kwa mara 3

rudia(3) {
  washa(1)
  subiri(500)
  zima(1)
  subiri(500)
}
    `;

	const [code, setCode] = useState(exampleCode);

	const [command, setCommand] = useState("");
	const [output, setOutput] = useState<string[]>([]);
	const [programState, setProgramState] = useState<ProgramState>("idle");
	const programStateRef = useRef<ProgramState>("idle");
	const [currentLine, setCurrentLine] = useState(-1);
	const [error, setError] = useState<string | null>(null);
	const [loop, setLoop] = useState(true);
	const [codeCleared, setCodeCleared] = useState(false);

	const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Auto-scroll output to bottom
	useEffect(() => {
		setLoop(false);
	}, [output]);

	const addOutput = (
		message: string,
		type: "info" | "error" | "success" = "info",
	) => {
		const timestamp = new Date().toLocaleTimeString();
		const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
		setOutput((prev) => [...prev, `[${timestamp}] ${prefix} ${message}`]);
	};

	 const executeCommand = (cmd: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			const trimmedCmd = cmd.trim();

			if (!trimmedCmd || trimmedCmd.startsWith("//")) {
				resolve();
				return;
			}

			// Tafsiri amri
			const washaMatch = trimmedCmd.match(/^washa\((\d+)\)$/);
			const zimaMatch = trimmedCmd.match(/^zima\((\d+)\)$/);
			const subiriMatch = trimmedCmd.match(/^subiri\((\d+)\)$/);

			if (washaMatch) {
				const componentIndex = Number.parseInt(washaMatch[1]) - 1;
				if (componentIndex >= 0 && componentIndex < components.length) {
					setComponents((prev) =>
						prev.map((comp, i) =>
							i === componentIndex ? { ...comp, active: true } : comp,
						),
					);
					addOutput(
						`Kifaa nambari ${componentIndex + 1} kimewashwa`,
						"success",
					);
					resolve();
				} else {
					const errorMsg = `Nambari ya kifaa si sahihi: ${componentIndex + 1}`;
					addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else if (zimaMatch) {
				const componentIndex = Number.parseInt(zimaMatch[1]) - 1;
				if (componentIndex >= 0 && componentIndex < components.length) {
					setComponents((prev) =>
						prev.map((comp, i) =>
							i === componentIndex ? { ...comp, active: false } : comp,
						),
					);
					addOutput(`Kifaa nambari ${componentIndex + 1} kimezimwa`, "success");
					resolve();
				} else {
					const errorMsg = `Nambari ya kifaa si sahihi: ${componentIndex + 1}`;
					addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else if (subiriMatch) {
				const delayMs = Number.parseInt(subiriMatch[1]);
				addOutput(`Inasubiri kwa ${delayMs}ms...`);
				executionTimeoutRef.current = setTimeout(() => {
					addOutput(`Muda wa kusubiri umeisha`);
					resolve();
				}, delayMs);
			} else {
				const errorMsg = `Amri haijulikani: ${trimmedCmd}`;
				addOutput(errorMsg, "error");
				reject(new Error(errorMsg));
			}
		});
	};

	// Preprocessor to expand rudia() blocks
	const preprocessCode = (code: string): string => {
		const lines = code.split('\n');
		const expandedLines: string[] = [];
		let i = 0;

		while (i < lines.length) {
			const line = lines[i].trim();
			const rudiaMatch = line.match(/^rudia\((\d+)\)\s*\{$/);

			if (rudiaMatch) {
				const repeatCount = Number.parseInt(rudiaMatch[1]);
				// Find the matching closing brace
				let braceCount = 1;
				let j = i + 1;
				const blockLines: string[] = [];

				while (j < lines.length && braceCount > 0) {
					const currentLine = lines[j].trim();
					if (currentLine === '{') {
						braceCount++;
						blockLines.push(lines[j]);
					} else if (currentLine === '}') {
						braceCount--;
						if (braceCount > 0) {
							blockLines.push(lines[j]);
						}
					} else {
						blockLines.push(lines[j]);
					}
					j++;
				}

				// Expand the block by repeating it
				expandedLines.push(`// rudia(${repeatCount}) imeenezwa hapa:`);
				for (let repeat = 0; repeat < repeatCount; repeat++) {
					expandedLines.push(`// --- Mzunguko ${repeat + 1}/${repeatCount} ---`);
					expandedLines.push(...blockLines);
				}
				expandedLines.push(`// --- Mwisho wa rudia ---`);

				i = j; // Skip to after the block
			} else {
				// Keep the line as is
				if (lines[i].trim() || i === 0) {
					expandedLines.push(lines[i]);
				}
				i++;
			}
		}

		return expandedLines.join('\n');
	};

	const startProgram = async () => {
		if (programStateRef.current === "running") return;

		setProgramState("running");
		programStateRef.current = "running";
		setCurrentLine(-1);
		setError(null);
		addOutput("🚀 Kuanzisha utekelezaji wa programu...");

		// Preprocess code to expand rudia() blocks
		const processedCode = preprocessCode(code);
		const lines = processedCode.split("\n");

		// Msaidizi wa kutekeleza kila mstari mmoja baada wa mwingine
		const runLine = async (i: number): Promise<void> => {
			if (i >= lines.length) {
				if (loop && programStateRef.current === "running") {
					setCurrentLine(-1);
					setTimeout(() => runLine(0), 0);
					return;
				} else {
					// Mwisho wa programu, simamisha utekelezaji
					addOutput("✨ Programu imekamilika kwa mafanikio!", "success");
					setProgramState("idle");
					programStateRef.current = "idle";
					setCurrentLine(-1);
					return;
				}
			}
			if (programStateRef.current !== "running") {
				setCurrentLine(-1);
				return;
			}
			setCurrentLine(i);
			const line = lines[i].trim();
			if (line && !line.startsWith("//")) {
				addOutput(`Inatekeleza: ${line}`);
				try {
					await executeCommand(line);
				} catch (error) {
					addOutput(`Programu imesimama kutokana na kosa: ${error}`, "error");
					setProgramState("idle");
					programStateRef.current = "idle";
					setError(error instanceof Error ? error.message : String(error));
					setCurrentLine(-1);
					return;
				}
			}
			// Nenda kwenye mstari unaofuata baada ya amri ya sasa kukamilika
			setTimeout(() => runLine(i + 1), 0);
		};

		runLine(0);
	};

	const stopProgram = () => {
		if (executionTimeoutRef.current) {
			clearTimeout(executionTimeoutRef.current);
			executionTimeoutRef.current = null;
		}
		setProgramState("idle");
		programStateRef.current = "idle";
		setCurrentLine(-1);
		addOutput("⏹️ Utekelezaji wa programu umesimamishwa", "info");
	};

	const resetComponents = () => {
		setComponents((prev) => prev.map((comp) => ({ ...comp, active: false })));
		addOutput("🔄 Vifaa vyote vimeresetishwa", "info");
	};

	const executeDirectCommand = () => {
		if (!command.trim()) return;

		addOutput(`> ${command}`);
		executeCommand(command)
			.then(() => {
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
			});

		setCommand("");
	};

	const clearOutput = () => {
		setOutput([]);
	};

	return (
		<div className="grid h-screen max-h-screen grid-cols-1 gap-6 p-4 lg:grid-cols-2">
			{/* Upande wa Kushoto - Mhariri wa Msimbo na Terminal */}
			<div className="fit mb-2 flex flex-col justify-start gap-4">
				{/* Mhariri wa Msimbo */}
				<CodeEditorComponent
					code={code}
					setCode={setCode}
					programState={programState}
					currentLine={currentLine}
					exampleCode={exampleCode}
					codeCleared={codeCleared}
					setCodeCleared={setCodeCleared}
					startProgram={startProgram}
					stopProgram={stopProgram}
					resetComponents={resetComponents}
				/>

				{/* Terminal */}
				<TerminalComponent
					output={output}
					error={error}
					programState={programState}
					command={command}
					setCommand={setCommand}
					executeDirectCommand={executeDirectCommand}
					clearOutput={clearOutput}
				/>
			</div>

			{/* Upande wa Kulia - Vifaa vya Elektroniki */}
			<ElectronicsDisplayComponent
				components={components}
				programState={programState}
				startProgram={startProgram}
				stopProgram={stopProgram}
				resetComponents={resetComponents}
			/>
		</div>
	);
}
