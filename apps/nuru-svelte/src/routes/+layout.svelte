<script>
	import '../styles/app.css';

	import '$lib/wasm_exec.js';
	let { children } = $props();
</script>


<div class="flex h-[100dvh] flex-col">
	<div class="flex justify-between bg-slate-900 px-10 text-foreground border-b">
		<div class="flex items-center p-4">
			<a href="/" class="flex gap-1 text-xl font-bold uppercase">
				Uwanja wa
				<p class="text-yellow-500">Nuru</p>
			</a>
		</div>
		<div class="flex items-center gap-10 p-4 text-muted-foreground hover:[&>a]:text-foreground">
			<a href="https://nuruprogramming.org/" target="_blank" class="text-lg">Nyaraka</a>
			<a href="https://github.com/Heracraft/nuru-playground" target="_blank" class="text-lg"
				>GitHub</a
			>
		</div>
	</div>
	{@render children()}
</div>
