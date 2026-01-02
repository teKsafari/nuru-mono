import type {
	ExecutorCallbacks,
	ExecutorConfig,
	ProgramState,
	OutputType,
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
	 * Add output message with timestamp
	 */
	private addOutput(message: string, type: OutputType = "info") {
		const timestamp = new Date().toLocaleTimeString();
		const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
		this.callbacks.onOutput(`[${timestamp}] ${prefix} ${message}`, type);
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

			// Parse commands (Tafsiri amri)
			const washaMatch = trimmedCmd.match(/^washa\((\d+)\)$/);
			const zimaMatch = trimmedCmd.match(/^zima\((\d+)\)$/);
			const subiriMatch = trimmedCmd.match(/^subiri\((\d+)\)$/);

			if (washaMatch) {
				const componentIndex = Number.parseInt(washaMatch[1]) - 1;
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
					const errorMsg = `Nambari ya kifaa si sahihi: ${componentIndex + 1}`;
					this.addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else if (zimaMatch) {
				const componentIndex = Number.parseInt(zimaMatch[1]) - 1;
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
					const errorMsg = `Nambari ya kifaa si sahihi: ${componentIndex + 1}`;
					this.addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else if (subiriMatch) {
				const delayMs = Number.parseInt(subiriMatch[1]);
				this.addOutput(`Inasubiri kwa ${delayMs}ms...`);
				this.executionTimeout = setTimeout(() => {
					this.addOutput(`Muda wa kusubiri umeisha`);
					resolve();
				}, delayMs);
			} else {
				const errorMsg = `Amri haijulikani: ${trimmedCmd}`;
				this.addOutput(errorMsg, "error");
				reject(new Error(errorMsg));
			}
		});
	}

	/**
	 * Preprocessor to expand rudia() blocks (loop expansion)
	 */
	preprocessCode(code: string): string {
		const lines = code.split("\n");
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
					if (currentLine === "{") {
						braceCount++;
						blockLines.push(lines[j]);
					} else if (currentLine === "}") {
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
					expandedLines.push(
						`// --- Mzunguko ${repeat + 1}/${repeatCount} ---`,
					);
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

		return expandedLines.join("\n");
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
		this.addOutput("🚀 Kuanzisha utekelezaji wa programu...");

		// Preprocess code to expand rudia() blocks
		const processedCode = this.preprocessCode(code);
		const lines = processedCode.split("\n");

		// Helper to execute each line one after another
		const runLine = async (i: number): Promise<void> => {
			if (i >= lines.length) {
				if (this.config.loop && this.programState === "running") {
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
 * Default component configuration
 */
export const DEFAULT_COMPONENTS = [
	{ active: false, type: "led" as const, color: "red" },
	{ active: false, type: "led" as const, color: "green" },
	{ active: false, type: "led" as const, color: "blue" },
	{ active: false, type: "buzzer" as const },
	{ active: false, type: "motor" as const },
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
