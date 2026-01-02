"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import TerminalComponent from "./terminal-component";
import CodeEditorComponent from "./code-editor-component";
import ElectronicsDisplayComponent from "./electronics-display-component";
import {
	ElectronicsExecutor,
	DEFAULT_COMPONENTS,
	EXAMPLE_CODE,
} from "@/lib/electronicsExecutor";
import type { ComponentState, ProgramState } from "@/types/electronics";

export default function ElectronicsSimulator() {
	const [components, setComponents] =
		useState<ComponentState[]>(DEFAULT_COMPONENTS);
	const [code, setCode] = useState(EXAMPLE_CODE);
	const [command, setCommand] = useState("");
	const [output, setOutput] = useState<string[]>([]);
	const [programState, setProgramState] = useState<ProgramState>("idle");
	const [currentLine, setCurrentLine] = useState(-1);
	const [error, setError] = useState<string | null>(null);
	const [codeCleared, setCodeCleared] = useState(false);

	// Executor reference
	const executorRef = useRef<ElectronicsExecutor | null>(null);

	// Initialize executor with callbacks
	useEffect(() => {
		executorRef.current = new ElectronicsExecutor(
			{
				onComponentChange: (index, active) => {
					setComponents((prev) =>
						prev.map((comp, i) => (i === index ? { ...comp, active } : comp)),
					);
				},
				onOutput: (message) => {
					setOutput((prev) => [...prev, message]);
				},
				onLineChange: (line) => {
					setCurrentLine(line);
				},
				onStateChange: (state) => {
					setProgramState(state);
				},
				onError: (err) => {
					setError(err);
				},
			},
			{
				componentCount: DEFAULT_COMPONENTS.length,
				loop: false,
			},
		);

		return () => {
			executorRef.current?.destroy();
		};
	}, []);

	const startProgram = useCallback(() => {
		executorRef.current?.startProgram(code);
	}, [code]);

	const stopProgram = useCallback(() => {
		executorRef.current?.stopProgram();
	}, []);

	const resetComponents = useCallback(() => {
		executorRef.current?.resetAllComponents();
	}, []);

	const executeDirectCommand = useCallback(() => {
		if (!command.trim()) return;
		executorRef.current?.executeDirectCommand(command);
		setCommand("");
	}, [command]);

	const clearOutput = useCallback(() => {
		setOutput([]);
	}, []);

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
					exampleCode={EXAMPLE_CODE}
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
