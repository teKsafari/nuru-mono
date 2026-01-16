// Entry point into the @nuru/wasm package
// Browser only so far

import "./wasm_exec";

import xss from "xss";

declare global {
	var nuruOutputReceiver: (codeOutput: string, isError: boolean) => void;
	var runCode: (code: string) => void;
}

type interpreterConfig = {
	outputReceiver: (output: string, isError: boolean) => void;
	xssProtection?: boolean;
	version?: string;
};
export type NuruInstance = {
	config: interpreterConfig;
	initialized: boolean;
	execute: typeof execute;
};

let initialized = false;
let outputReceiverRegistered = false;

let defaultConfig: Required<Omit<interpreterConfig, "outputReceiver">> = { // Ugly type shenanigans, I know.
	xssProtection: true,
	version: "latest",
};

async function loadWasmBinary(url: string) {
	// Start the fetch request
	const response = await fetch(url);

	if (!response.ok) {
		console.log(response);
		throw new Error(`Failed to fetch ${url}`);
	}

	// Get the total size from the headers
	const contentLength = response.headers.get("Content-Length");
	if (!contentLength) {
		throw new Error("Content-Length header is missing");
	}

	if (!response.body) throw new Error("Response body is empty");

	// Create a reader to track the stream
	const reader = response.body.getReader();
	// const total = parseInt(contentLength, 10); // was used to track loading progress
	// misbehaves in prod. Commented for now

	let received = 0;

	// Create an array buffer to hold the WASM bytes
	let chunks = [];

	// Read the stream in chunks
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		// Track received bytes
		chunks.push(value);
		received += value.length;

		// let percentComplete = Math.round((received / total) * 100);
	}

	// Combine the chunks into a single buffer
	const wasmBytes = new Uint8Array(received);
	let position = 0;
	for (let chunk of chunks) {
		wasmBytes.set(chunk, position);
		position += chunk.length;
	}

	return wasmBytes;
}

// TODO: Update dev script for @nuru-wasm to include a go watcher too

export function registerOutputReceiver(outputEffect: (codeOutput: string, isError: boolean) => void, xssProtection: boolean) {
	// Registers the output (nuruOutputReceiver) capture function
	// esentially a bridge from the wasm/go binary. all outputs (errors and prints to the console)
	// Will be received by the (nuruOutputReceiver) capture function and passed onto the effect function

	if (!globalThis) return;

	globalThis.nuruOutputReceiver = function (codeOutput: string, isError = false) {
		if (xssProtection) {
			codeOutput = xss(codeOutput, {
				whiteList: {},
				stripIgnoreTag: true,
			});
		}

		// Why? Well, the output could contain HTML tags
		// We want colorful outputs (red when error) in our output section and line breaks
		// So we're embedding the error inside a span element
		// Or in nothing plus a line break if there's no error
		// But the user could do something like `andika("<img src=x onerror=alert(1)>")`
		// Then we inject this output as a html
		// Bam, we have XSS
		// So we'll purify the output, format it with HTML (if error) then inject that shi

		outputEffect(codeOutput, isError);
	};
}

export function execute(code: string) {
	if (!initialized) throw new Error("Wasm binary not initialized. Call init()");
	if (!globalThis.runCode) throw new Error("runCode interface not found, Did you call init()?");
	if (!outputReceiverRegistered) throw new Error("Output receiver not registered. Did you call registerOutputReceiver()?");

	globalThis.runCode(code);
}

export default async function init(config: interpreterConfig): Promise<NuruInstance> {
	config = { ...defaultConfig, ...config };

	if (!config.outputReceiver) throw new Error("output receiver not specified. Pass it in the config");

	registerOutputReceiver(config.outputReceiver, config.xssProtection);
	outputReceiverRegistered=true

	// let wasmBinaryUrl = "/main.wasm";
	let wasmBinaryUrl = `https://cdn.jsdelivr.net/npm/@nuru/wasm@${config.version}/main.wasm`;

	return new Promise<NuruInstance>(async (resolve, reject) => {
		const go = new Go();

		const wasmBytes = await loadWasmBinary(wasmBinaryUrl);

		WebAssembly.instantiate(wasmBytes.buffer, go.importObject)
			.then((result) => {
				go.run(result.instance);

				initialized = true;

				resolve({
					config,
					initialized,
					execute,
				});
			})
			.catch((error) => {
				console.error(error);
				reject("Wasm binary could not be loaded an intialized");
			});
	});
}
