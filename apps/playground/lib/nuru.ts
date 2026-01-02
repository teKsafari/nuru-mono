/**
 * Nuru WASM Singleton
 *
 * Provides a reusable singleton instance of the Nuru interpreter.
 * Handles initialization, output capture, and automatic recovery from errors.
 */

import init, { NuruInstance } from "@nuru/wasm";

// Singleton state
let nuruInstance: NuruInstance | null = null;
let currentOutputHandler: ((text: string) => void) | null = null;

/**
 * Global output receiver for WASM
 * Routes interpreter output to the current handler
 */
function globalOutputReceiver(text: string) {
	if (currentOutputHandler) {
		currentOutputHandler(`${text}\n`);
	}
}

/**
 * Get or initialize the Nuru WASM instance
 * Uses singleton pattern - returns existing instance if available
 */
export async function getNuru(): Promise<NuruInstance> {
	if (!nuruInstance) {
		nuruInstance = await init({
			outputReceiver: globalOutputReceiver,
		});
	}
	return nuruInstance;
}

/**
 * Reset the Nuru instance (useful after errors like stack overflow)
 */
export function resetNuru(): void {
	nuruInstance = null;
}

/**
 * Execute Nuru code and capture output
 * Handles errors gracefully and resets instance on critical failures
 */
export async function executeNuru(code: string): Promise<string> {
	const nuru = await getNuru();
	let outputBuffer = "";

	// Set handler to capture this run's output
	currentOutputHandler = (text) => {
		outputBuffer += text;
	};

	try {
		await nuru.execute(code);
	} catch (e) {
		outputBuffer += e;
		// Reset instance on error to allow recovery
		resetNuru();
	} finally {
		currentOutputHandler = null;
	}

	return outputBuffer;
}



/**
 * Set a custom output handler for advanced use cases
 * (e.g., streaming output to a terminal)
 */
export function setOutputHandler(
	handler: ((text: string) => void) | null,
): void {
	currentOutputHandler = handler;
}


