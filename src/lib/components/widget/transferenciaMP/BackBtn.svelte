<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
</script>

<div class="w-full bg-mp">
	<div class="inline-flex justify-between px-8 pb-4 pt-4 w-full text-white">
		<button on:click={() => dispatch('goBack', {})} type="button" class="flex gap-2 text-xl items-center">
			<img src="/images/left-arrow-white.svg" alt="left-arrow1.svg" class="h-4" /> Atrás
		</button>
	</div>
</div>

