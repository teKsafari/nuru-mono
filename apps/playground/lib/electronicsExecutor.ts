import type {
	ExecutorCallbacks,
	ExecutorConfig,
	ProgramState,
	OutputType,
	ComponentState,
} from "@/types/electronics";

/**
 * ElectronicsExecutor - Decoupled execution engine for electronics commands
 *
 * This class handles the parsing, preprocessing, and execution of custom electronics
 * command codes (washa, zima, subiri, rudia) independent of any UI component.
 * It can be reused across the program by importing it.
 */
export class ElectronicsExecutor {
	private callbacks: ExecutorCallbacks;
	private config: ExecutorConfig;
	private programState: ProgramState = "idle";
	private executionTimeout: NodeJS.Timeout | null = null;
	private currentLine: number = -1;
	private outputBuffer: string[] = [];
	private variables: Map<string, number> = new Map();

	constructor(callbacks: ExecutorCallbacks, config: ExecutorConfig) {
		this.callbacks = callbacks;
		this.config = config;
	}

	/**
	 * Get current program state
	 */
	getState(): ProgramState {
		return this.programState;
	}

	/**
	 * Get current executing line
	 */
	getCurrentLine(): number {
		return this.currentLine;
	}

	/**
	 * Add output message (optionally with timestamp)
	 */
	private addOutput(
		message: string,
		type: OutputType = "info",
		includeTimestamp = true,
	) {
		const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
		const formattedMessage = includeTimestamp
			? `[${new Date().toLocaleTimeString()}] ${prefix} ${message}`
			: `${prefix} ${message}`;
		this.outputBuffer.push(formattedMessage);
		this.callbacks.onOutput(formattedMessage, type);
	}

	/**
	 * Evaluate a mathematical expression or variable
	 */
	private evaluateExpression(expr: string): number {
		// remove whitespace
		const cleanExpr = expr.trim();

		// Check if it's a simple number
		if (!Number.isNaN(Number(cleanExpr))) {
			return Number(cleanExpr);
		}

		// Check if it's a variable
		if (this.variables.has(cleanExpr)) {
			return this.variables.get(cleanExpr) || 0;
		}

		// Handle basic arithmetic operations usually passed as "var + 1" or "3 * 2"
		// This is a very basic parser for the sake of the requested feature
		try {
			// Replace variables with their values in the string
			// We sort by length descending to avoid replacing substrings (e.g. "count" vs "count2")
			let evalStr = cleanExpr;
			const sortedVars = Array.from(this.variables.keys()).sort(
				(a, b) => b.length - a.length,
			);

			for (const va of sortedVars) {
				const val = this.variables.get(va);
				// Use regex with word boundary to ensure we match whole variable names
				const regex = new RegExp(`\\b${va}\\b`, "g");
				evalStr = evalStr.replace(regex, String(val));
			}

			// Allow only safe characters for evaluation: digits, +, -, *, /, (, ), ., whitespace
			if (!/^[0-9+\-*/().\s]+$/.test(evalStr)) {
				// If we still have letters, it means undefined variable or invalid syntax
				if (/[a-zA-Z]/.test(evalStr)) {
					throw new Error(`Kigezo kisichojulikana au sintaksia batili: ${cleanExpr}`);
				}
			}

			// Use Function to evaluate safe math string
			// eslint-disable-next-line
			return new Function(`return ${evalStr}`)();
		} catch (e) {
			console.error("Evaluation error:", e);
			throw new Error(`Imeshindwa kutathmini: ${cleanExpr}`);
		}
	}

	/**
	 * Execute a single command
	 */
	executeCommand(cmd: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const trimmedCmd = cmd.trim();

			if (!trimmedCmd || trimmedCmd.startsWith("//")) {
				resolve();
				return;
			}

			// Check for Assignment (e.g. wa = 1 or wa = wa + 1)
			if (trimmedCmd.includes("=") && !trimmedCmd.startsWith("if")) {
				const parts = trimmedCmd.split("=");
				if (parts.length === 2) {
					const varName = parts[0].trim();
					const expression = parts[1].trim();
					
					// Validate variable name (simple alphanumeric)
					if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
						const errorMsg = `Jina la kigezo si sahihi: ${varName}`;
						this.addOutput(errorMsg, "error");
						reject(new Error(errorMsg));
						return;
					}

					try {
						const value = this.evaluateExpression(expression);
						this.variables.set(varName, value);
						// Optional: Log assignment for debug?
						// this.addOutput(`${varName} = ${value}`, "info", false);
						resolve();
						return;
					} catch (e: any) {
						const errorMsg = e.message || `Kosa katika kuweka kigezo: ${trimmedCmd}`;
						this.addOutput(errorMsg, "error");
						reject(new Error(errorMsg));
						return;
					}
				}
			}

			// Parse commands using regex that allows expressions inside parens
			// washa(variable) or washa(1+1)
			const commandMatch = trimmedCmd.match(/^([a-z]+)\((.*)\)$/);

			if (commandMatch) {
				const command = commandMatch[1];
				const argStr = commandMatch[2];
				let argValue: number;

				try {
					argValue = this.evaluateExpression(argStr);
				} catch (e: any) {
					this.addOutput(e.message, "error");
					reject(new Error(e.message));
					return;
				}

				if (command === "washa") {
					const componentIndex = argValue - 1;
					if (
						componentIndex >= 0 &&
						componentIndex < this.config.componentCount
					) {
						this.callbacks.onComponentChange(componentIndex, true);
						this.addOutput(
							`Kifaa nambari ${componentIndex + 1} kimewashwa`,
							"success",
						);
						resolve();
					} else {
						const errorMsg = `Nambari ya kifaa si sahihi: ${argValue}`;
						this.addOutput(errorMsg, "error");
						reject(new Error(errorMsg));
					}
				} else if (command === "zima") {
					const componentIndex = argValue - 1;
					if (
						componentIndex >= 0 &&
						componentIndex < this.config.componentCount
					) {
						this.callbacks.onComponentChange(componentIndex, false);
						this.addOutput(
							`Kifaa nambari ${componentIndex + 1} kimezimwa`,
							"success",
						);
						resolve();
					} else {
						const errorMsg = `Nambari ya kifaa si sahihi: ${argValue}`;
						this.addOutput(errorMsg, "error");
						reject(new Error(errorMsg));
					}
				} else if (command === "subiri") {
					const delayMs = argValue;
					this.addOutput(`Inasubiri kwa ${delayMs}ms...`);
					this.executionTimeout = setTimeout(() => {
						this.addOutput(`Muda wa kusubiri umeisha`);
						resolve();
					}, delayMs);
				} else {
					const errorMsg = `Amri haijulikani: ${command}`;
					this.addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else {
				const errorMsg = `Amri haijulikani au muundo si sahihi: ${trimmedCmd}`;
				this.addOutput(errorMsg, "error");
				reject(new Error(errorMsg));
			}
		});
	}

	/**
	 * Preprocessor to expand rudia() blocks recursively
	 */
	preprocessCode(code: string): string {
		const lines = code.split("\n");
		
		const expandBlock = (inputLines: string[]): string[] => {
			const expandedLines: string[] = [];
			let i = 0;

			while (i < inputLines.length) {
				const line = inputLines[i].trim();
				const rudiaMatch = line.match(/^rudia\((.*)\)\s*\{$/);

				if (rudiaMatch) {
					// We need to evaluate the expression inside rudia() later? 
					// Actually, for Loop Unrolling (which is what we are doing here), 
					// we require a STATIC number for now because we unroll at compile time.
					// If we want dynamic loops, we'd need a full interpreter execution loop.
					// For this "rudimentary" interpreter, we will stick to unrolling.
					// However, the user REQUESTED "rudia(3) { ... rudia(9) { ... } }"
					// So basic number parsing is enough for now. 
					// If the user puts a variable "rudia(wa)", this unrolling will fail 
					// unless we change the architecture to a runtime loop instead of pre-unrolling.
					// Given the scope "Update rudimentary interpreter... basic variables stuff",
					// I will stick to unrolling with static numbers for now, but fully recursive.
					
					// If logic requires runtime loop counts (rudia(x)), that's a much bigger refactor
					// (moving away from line-by-line async execution to an AST walker).
					// The prompt example shows "rudia(3)" and "rudia(9)", which are static.

					let repeatCount = 0;
					try {
						// Attempt to parse simple number
						repeatCount = parseInt(rudiaMatch[1]);
					} catch (e) {
						repeatCount = 0;
					}

					// Find the matching closing brace
					let braceCount = 1;
					let j = i + 1;
					const blockLines: string[] = [];

					while (j < inputLines.length && braceCount > 0) {
						const currentLine = inputLines[j].trim();
						if (currentLine.endsWith("{") && (currentLine.startsWith("rudia") || currentLine.startsWith("kama"))) {
							braceCount++;
							blockLines.push(inputLines[j]);
						} else if (currentLine === "}") {
							braceCount--;
							if (braceCount > 0) {
								blockLines.push(inputLines[j]);
							}
						} else {
							blockLines.push(inputLines[j]);
						}
						j++;
					}

					// Recursively expand the block content
					const expandedBlock = expandBlock(blockLines);

					// Expand the block by repeating it
					expandedLines.push(`// rudia(${repeatCount}) imeenezwa hapa:`);
					for (let repeat = 0; repeat < repeatCount; repeat++) {
						expandedLines.push(
							`// --- Mzunguko ${repeat + 1}/${repeatCount} ---`,
						);
						expandedLines.push(...expandedBlock);
					}
					expandedLines.push(`// --- Mwisho wa rudia ---`);

					i = j; // Skip to after the block
				} else {
					// Keep the line as is
					expandedLines.push(inputLines[i]);
					i++;
				}
			}
			return expandedLines;
		};

		return expandBlock(lines).join("\n");
	}

	/**
	 * Run program and return output as string (for playground integration)
	 */
	async run(code: string): Promise<string> {
		this.outputBuffer = [];
		this.variables.clear(); // Reset variables on new run

		return new Promise((resolve) => {
			const originalOnOutput = this.callbacks.onOutput;
			const originalOnStateChange = this.callbacks.onStateChange;

			// Override to capture completion
			this.callbacks.onStateChange = (state) => {
				originalOnStateChange(state);
				if (state === "idle" && this.programState === "idle") {
					// Restore original callbacks
					this.callbacks.onOutput = originalOnOutput;
					this.callbacks.onStateChange = originalOnStateChange;
					resolve(this.outputBuffer.join("\n"));
				}
			};

			this.startProgram(code);
		});
	}

	/**
	 * Start program execution
	 */
	async startProgram(code: string): Promise<void> {
		if (this.programState === "running") return;

		this.programState = "running";
		this.callbacks.onStateChange("running");
		this.currentLine = -1;
		this.callbacks.onLineChange(-1);
		this.callbacks.onError(null);
		this.variables.clear(); // Ensure variables are cleared
		this.addOutput("🚀 Kuanzisha utekelezaji wa programu...");

		// Preprocess code to expand rudia() blocks
		const processedCode = this.preprocessCode(code);
		const lines = processedCode.split("\n");

		// Helper to execute each line one after another
		const runLine = async (i: number): Promise<void> => {
			if (i >= lines.length) {
				if (this.config.loop && this.programState === "running") {
					// Simple infinite loop of the whole program
					// Note: Variables are preserved across main loops if config.loop is true?
					// Usually in embedded loop() variables persist. Let's keep them.
					this.currentLine = -1;
					this.callbacks.onLineChange(-1);
					setTimeout(() => runLine(0), 0);
					return;
				} else {
					// End of program, stop execution
					this.addOutput("✨ Programu imekamilika kwa mafanikio!", "success");
					this.programState = "idle";
					this.callbacks.onStateChange("idle");
					this.currentLine = -1;
					this.callbacks.onLineChange(-1);
					return;
				}
			}
			if (this.programState !== "running") {
				this.currentLine = -1;
				this.callbacks.onLineChange(-1);
				return;
			}
			this.currentLine = i;
			this.callbacks.onLineChange(i);
			const line = lines[i].trim();
			if (line && !line.startsWith("//")) {
				this.addOutput(`Inatekeleza: ${line}`);
				try {
					await this.executeCommand(line);
				} catch (error) {
					this.addOutput(
						`Programu imesimama kutokana na kosa: ${error}`,
						"error",
					);
					this.programState = "idle";
					this.callbacks.onStateChange("idle");
					this.callbacks.onError(
						error instanceof Error ? error.message : String(error),
					);
					this.currentLine = -1;
					this.callbacks.onLineChange(-1);
					return;
				}
			}
			// Go to next line after current command completes
			setTimeout(() => runLine(i + 1), 0);
		};

		runLine(0);
	}

	/**
	 * Stop program execution
	 */
	stopProgram(): void {
		if (this.executionTimeout) {
			clearTimeout(this.executionTimeout);
			this.executionTimeout = null;
		}
		this.programState = "idle";
		this.callbacks.onStateChange("idle");
		this.currentLine = -1;
		this.callbacks.onLineChange(-1);
		this.addOutput("⏹️ Utekelezaji wa programu umesimamishwa", "info");
	}

	/**
	 * Reset all components to inactive state
	 */
	resetAllComponents(): void {
		for (let i = 0; i < this.config.componentCount; i++) {
			this.callbacks.onComponentChange(i, false);
		}
		this.addOutput("🔄 Vifaa vyote vimeresetishwa", "info");
	}

	/**
	 * Execute a direct command (single command execution)
	 */
	async executeDirectCommand(command: string): Promise<void> {
		if (!command.trim()) return;

		this.addOutput(`> ${command}`);
		try {
			await this.executeCommand(command);
			this.callbacks.onError(null);
		} catch (err) {
			this.callbacks.onError(err instanceof Error ? err.message : String(err));
		}
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<ExecutorConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Cleanup resources
	 */
	destroy(): void {
		if (this.executionTimeout) {
			clearTimeout(this.executionTimeout);
			this.executionTimeout = null;
		}
		this.programState = "idle";
	}
}

/**
 * Create a new ElectronicsExecutor instance
 * Factory function for convenience
 */
export function createElectronicsExecutor(
	callbacks: ExecutorCallbacks,
	config: ExecutorConfig,
): ElectronicsExecutor {
	return new ElectronicsExecutor(callbacks, config);
}

/**
 * Default component configuration - extends Gpio
 */
export const DEFAULT_COMPONENTS: ComponentState[] = [
	{ pin: 1, isEnabled: false, isInput: false, type: "led", color: "red" },
	{ pin: 2, isEnabled: false, isInput: false, type: "led", color: "green" },
	{ pin: 3, isEnabled: false, isInput: false, type: "led", color: "blue" },
	{ pin: 4, isEnabled: false, isInput: false, type: "buzzer" },
	{ pin: 5, isEnabled: false, isInput: false, type: "motor" },
    // Add generic components up to 20 to allow for larger simulations/experiments
    ...Array.from({ length: 15 }, (_, i) => ({
        pin: i + 6,
        isEnabled: false,
        isInput: false,
        type: "led" as const,
        color: "red"
    }))
];

/**
 * Example code template
 */
export const EXAMPLE_CODE = `// Mfano: Washa na Zima LED kwa mara 3

rudia(3) {
  washa(1)
  subiri(500)
  zima(1)
  subiri(500)
}
`;
