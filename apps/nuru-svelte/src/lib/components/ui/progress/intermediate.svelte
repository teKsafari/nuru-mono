<script lang="ts">
	import { Progress } from 'bits-ui';
</script>

<Progress.Root class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
	<!-- The inner div represents the "buffer" bar -->
	<div class="animate-indeterminate-progress h-full w-full flex-1 bg-primary transition-all"></div>
</Progress.Root>

<style>
	/* Define a custom animation for the buffering effect */
	@keyframes indeterminate {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	.animate-indeterminate-progress {
		animation: indeterminate 1s infinite linear;
	}
</style>
