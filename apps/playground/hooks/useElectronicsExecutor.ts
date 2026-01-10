"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
	ElectronicsExecutor,
	DEFAULT_COMPONENTS,
} from "@/lib/electronicsExecutor";
import type { ComponentState, ProgramState } from "@/types/electronics";
import type { LanguageExecutor } from "@/types/playground";

interface UseElectronicsExecutorReturn {
	executor: LanguageExecutor;
	components: ComponentState[];
	programState: ProgramState;
	currentLine: number;
	resetComponents: () => void;
	updateConfig: (config: Partial<import("@/types/electronics").ExecutorConfig>) => void;
}

/**
 * Custom hook that manages electronics executor state and returns
 * a LanguageExecutor-compatible interface for playground integration.
 */
export function useElectronicsExecutor(): UseElectronicsExecutorReturn {
	const [components, setComponents] = useState<ComponentState[]>(
		DEFAULT_COMPONENTS.map((c) => ({ ...c })),
	);
	const [programState, setProgramState] = useState<ProgramState>("idle");
	const [currentLine, setCurrentLine] = useState(-1);
	const executorRef = useRef<ElectronicsExecutor | null>(null);
	const outputBufferRef = useRef<string[]>([]);

	// Initialize executor with callbacks
	useEffect(() => {
		executorRef.current = new ElectronicsExecutor(
			{
				onComponentChange: (index, isEnabled) => {
					setComponents((prev) =>
						prev.map((c, i) => (i === index ? { ...c, isEnabled } : c)),
					);
				},
				onOutput: (message) => {
					outputBufferRef.current.push(message);
				},
				onLineChange: (line) => {
					setCurrentLine(line);
				},
				onStateChange: (state) => {
					setProgramState(state);
				},
				onError: () => {
					// Error handling is done via output
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

	const resetComponents = useCallback(() => {
		setComponents(DEFAULT_COMPONENTS.map((c) => ({ ...c })));
	}, []);

	const executor: LanguageExecutor = {
		language: "Electronics",
		run: async (code: string) => {
			outputBufferRef.current = [];

			if (!executorRef.current) {
				return "❌ Kosa: Executor haipo";
			}

			// Reset components before running
			resetComponents();

			// Return a promise that resolves when execution completes
			return new Promise((resolve) => {
				const checkCompletion = () => {
					if (executorRef.current?.getState() === "idle") {
						resolve(outputBufferRef.current.join("\n"));
					} else {
						setTimeout(checkCompletion, 100);
					}
				};

				executorRef.current?.startProgram(code);

				// Start checking after a small delay
				setTimeout(checkCompletion, 100);
			});
		},
		submit: async (code: string) => {
			// Same as run for electronics
			outputBufferRef.current = [];

			if (!executorRef.current) {
				return "❌ Kosa: Executor haipo";
			}

			resetComponents();

			return new Promise((resolve) => {
				const checkCompletion = () => {
					if (executorRef.current?.getState() === "idle") {
						const output = outputBufferRef.current.join("\n");
						if (output.includes("❌")) {
							resolve(output);
						} else {
							resolve(`✓ Imekamilika!\n\n${output}`);
						}
					} else {
						setTimeout(checkCompletion, 100);
					}
				};

				executorRef.current?.startProgram(code);
				setTimeout(checkCompletion, 100);
			});
		},
		onBeforeRun: () => {
			resetComponents();
		},
	};

	const updateConfig = useCallback((config: Partial<import("@/types/electronics").ExecutorConfig>) => {
		if (executorRef.current) {
			executorRef.current.updateConfig(config);
		}
	}, []);

	return {
		executor,
		components,
		programState,
		currentLine,
		resetComponents,
		updateConfig,
	};
}
