<script>
	import { onMount } from 'svelte';

	import { fly } from 'svelte/transition';

	import xss from 'xss';

	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Info } from 'lucide-svelte';

	let { code, outputEffect, children } = $props();
	let loadProgress = $state(0);

	let editorWrapper;

	let editor;

	function setUp() {
		// runs before the wasm binary is initialized
		// It's role is to register the output (nuruOutputReceiver) capture function
		// esentially a bridge from the wasm/go binary. all outputs (errors and prints to the console)
		// Will be received by the (nuruOutputReceiver) capture function and passed onto the effect function

		window.nuruOutputReceiver = function (codeOutput, isError = false) {
			// console.log('outpit', codeOutput);

			codeOutput = xss(codeOutput, {
				whiteList: {},
				stripIgnoreTag: true
			});
			// Why? Well, the output could contain HTML tags
			// We want colorful outputs (red when error) in our output section and line breaks
			// So we're embedding the error inside a span element
			// Or in nothing plus a line break if there's no error
			// But the user could do something like andika("<img src=x onerror=alert(1)>")
			// Then we inject this output as a html
			// Bam, we have XSS
			// So we'll purify the output, format it with HTML (if error) then inject that shi

			outputEffect(codeOutput, isError)
		};
	}

	async function loadWasmBinary(url) {
		// Start the fetch request
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch ${url}`);
		}

		// Get the total size from the headers
		const contentLength = response.headers.get('Content-Length');
		if (!contentLength) {
			throw new Error('Content-Length header is missing');
		}

		// Create a reader to track the stream
		const reader = response.body.getReader();
		const total = parseInt(contentLength, 10);
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

			// Update progress bar
			const percentComplete = Math.round((received / total) * 100);
			loadProgress = percentComplete;
		}

		// Combine the chunks into a single buffer
		const wasmBytes = new Uint8Array(received);
		let position = 0;
		for (let chunk of chunks) {
			wasmBytes.set(chunk, position);
			position += chunk.length;
		}

		loadProgress = 100; // fallback

		return wasmBytes;
	}

	onMount(async () => {
		const go = new Go();

		// `.instantiateStreaming` way more efficient at fetching but no way to track progress gotta use fetch/XHR
		// WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject).then((result) => {
		// 	go.run(result.instance);
		// 	runCode(code);
		// });

		// using fetch
		const wasmBytes = await loadWasmBinary('/main.wasm');

		setUp();

		WebAssembly.instantiate(wasmBytes.buffer, go.importObject).then((result) => {
			go.run(result.instance);
		});

		// Auto-run code. But is too annoying especially when you have user prompts.

		// $effect(() => {
		// 	if (code && window.runCode) {
		// 		setTimeout(() => {
		// 			runCode(code);
		// 		}, 1000);
		// 	}
		// });

		// Intercepting console.logs from "wasm_exec.js" - don't do this kids
		// Temp solution removed

		// const log = console.log.bind(console);
		// console.log = (...args) => {
		// 	log(...args);
		// 	output = args.join(' ');
		// };

		async () => {
			(await fetch('/main.wasm')).headers.get('Content-Length');
		};
	});
</script>

<div class="relative h-full w-full px-4 py-2">
	{#if loadProgress != 100}
		<div out:fly={{ y: -5 }} class="absolute inset-x-0 top-0 flex flex-col gap-2 bg-accent p-2">
			<div class="flex items-center gap-2">
				<Info size={16} />
				<!-- <p>Loading the interpreter - {loadProgress}%</p> -->
				<p>Loading the interpreter</p>
			</div>
			<Progress value={loadProgress} class="h-2"></Progress>
		</div>
	{/if}
	{@render children()}
</div>
