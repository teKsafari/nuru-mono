<script>
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	import init from '@nuru/wasm';

	import { basicSetup, EditorView } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { oneDark } from '@codemirror/theme-one-dark';

	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Intermediate } from '$lib/components/ui/progress/index.js';

	import { Button } from '$lib/components/ui/button';

	import { fly } from 'svelte/transition';

	import { File, Play, ChevronDown, Info } from 'lucide-svelte';

	import { cn } from '$lib/utils.js';

	import { defaultCode, samplePrograms } from '$lib';

	let nuru = $state();

	let code = $state(defaultCode);

	let isMedium = $state(true);

	let output = $state('');

	let editorWrapper;
	let editor;

	function outputEffect(newOutput, isError) {
		if (isError) {
			output += `<span class="text-red-400">${newOutput}</span><br/>`;
		} else {
			output += newOutput + '<br/>';
		}
	}

	onMount(async () => {
		nuru = await init({
			outputReceiver: outputEffect
		});

		isMedium = new MediaQuery('min-width: 640px', true);

		// CodeMirror setup

		let zincTheme = EditorView.theme(
			{
				'&': {
					fontFamily: 'Fira Code, monospace',
					fontSize: '1rem',
					backgroundColor: 'hsl(240 5.9% 10%) !important' // zinc-900
				},
				'.cm-content': {
					// fontSize: '1.25rem'
				},

				'.cm-gutters': {
					backgroundColor: 'hsl(240 3.7% 15.9%) !important' //zinc-800
				},
				'.cm-activeLine': {
					backgroundColor: 'hsl(240 3.7% 15.9% / 50%) !important' // zinc-800
				},
				'.cm-scroller': {
					scrollbarWidth: 'thin',
					scrollbarColor: 'hsl(240 3.7% 15.9%) hsl(240 5.9% 10%)' // <accent,background> zinc-800 ,zinc-900
				}
			},
			{ dark: true }
		);

		let slateTheme = EditorView.theme(
			{
				'&': {
					fontFamily: 'Fira Code, monospace',
					fontSize: '1rem',
					backgroundColor: 'hsl(222.2 84% 4.9%) !important', // slate-900
					height: '100%'
				},
				'.cm-content': {
					// fontSize: '1.25rem'
				},

				'.cm-gutters': {
					backgroundColor: 'rgba(30, 41, 59, .4) !important' //slate-800
				},
				'.cm-gutterElement:not(.cm-foldGutter>.cm-gutterElement)': {
					width: '2.5rem'
				},
				'.cm-activeLine': {
					backgroundColor: 'hsl(222.2 47.4% 11.2% / 50%) !important' // slate-800
				},
				'.cm-scroller': {
					scrollbarWidth: 'thin',
					scrollbarColor: 'hsl(222.2 47.4% 11.2%) hsl(222.2 84% 4.9%)' // <accent,background> slate-800 ,slate-900
				}
			},
			{ dark: true }
		);

		const initialState = EditorState.create({
			doc: code,
			extensions: [
				basicSetup,
				javascript(),
				oneDark,
				slateTheme,
				EditorView.updateListener.of((v) => {
					if (v.docChanged) {
						code = v.state.doc.toString();
						// console.log({ code });
					}
				}),
				EditorView.lineWrapping
			]
		});
		editor = new EditorView({
			state: initialState,
			parent: editorWrapper
		});
	});
</script>

{#snippet fileTab(name, isActive)}
	<div
		class={cn(
			'relative flex w-28 items-center justify-center gap-2 border-r py-3.5 text-sm',
			isActive
				? " after:absolute after:inset-x-[10%] after:top-full after:h-[1px] after:w-[80%] after:bg-yellow-600 after:content-['']"
				: ''
		)}
	>
		<File size={14} class="text-muted-foreground" />
		{name}
	</div>
{/snippet}

<Resizable.PaneGroup
	direction={isMedium.current ? 'horizontal' : 'vertical'}
	class="w-full flex-1 text-foreground"
>
	<Resizable.Pane defaultSize={50} class="flex flex-col overflow-auto">
		<div class="flex shrink-0 items-center justify-between border-b">
			<div class="flex items-center">
				{@render fileTab('Kuu.nr', true)}
				<!-- {@render fileTab('Mifano.nr', false)} -->
			</div>
			<Popover.Root>
				<Popover.Trigger asChild>
					<Button variant="ghost" class="mr-1">
						<span>Mifano</span>
						<ChevronDown size={16} class="text-muted-foreground" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-40. p-0" align="start">
					{#each Object.values(samplePrograms) as program}
						<button
							class="flex w-full flex-col px-4 py-2 text-start font-normal first:rounded-t-md last:rounded-b-md hover:cursor-pointer hover:bg-slate-900"
							onclick={() => {
								// code = program.code;
								editor.dispatch({
									changes: { from: 0, to: editor.state.doc.length, insert: program.code }
								});
							}}
						>
							<p class={cn('text-sm', code == program.code ? 'text-yellow-500' : '')}>
								{program.name}
							</p>
							<p class="text-xs text-muted-foreground">{program.description}</p>
						</button>
					{/each}
				</Popover.Content>
			</Popover.Root>
		</div>
		<!-- The editor -->
		<div bind:this={editorWrapper} class="h-full w-full"></div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={50}>
		<div class="mt-1 flex justify-between border-b pb-1">
			<div
				class="relative flex w-28 items-center justify-center gap-2 py-2.5 text-sm after:absolute after:inset-x-0 after:top-full after:h-[1px] after:w-full after:bg-yellow-600 after:content-['']"
			>
				Matokeo
			</div>
			<button
				disabled={!(nuru && nuru.initialized)}
				onclick={() => {
					nuru.execute(code);
				}}
				class="mr-2 rounded p-2 hover:bg-accent"
			>
				<Play size={20} class="text-yellow-500" />
			</button>
		</div>
		<div class="relative h-full w-full px-4 py-2">
			{#if !(nuru && nuru.initialized)}
				<div out:fly={{ y: -5 }} class="absolute inset-x-0 top-0 flex flex-col gap-2 bg-accent p-2">
					<div class="flex items-center gap-2">
						<Info size={16} />
						<p>Loading the interpreter</p>
					</div>
					<Intermediate class="h-1"></Intermediate>
				</div>
			{/if}
			{#if output != ''}
				{@html output}
			{:else}
				<i class="text-muted-foreground">Endesha program. Matokeo yatatokea hapa</i>
			{/if}
		</div>
		<!-- <Interpreter {code} {outputEffect}>
		</Interpreter>
		 -->
	</Resizable.Pane>
</Resizable.PaneGroup>
