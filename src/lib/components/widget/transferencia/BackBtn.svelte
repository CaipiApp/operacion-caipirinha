<script lang="ts">
	import { createEventDispatcher } from "svelte";


const dispatch = createEventDispatcher();
</script>

<div class="pt-4 max-w-sm mx-auto w-full">
	<div class="inline-flex w-full items-center justify-between">
		<button on:click={() => dispatch('goBack', {})} type="button" class="inline-flex gap-2 text-xl items-center text-secondary" >
			<img src="/images/left-arrow1.svg" alt="left-arrow1.svg" class="h-4" /> Atrás
		</button>
	</div>
	<hr class="border-secondary max-w-xl mx-auto mt-2" />
</div>
