<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	let show = false; // menu state
	let menu: any = null; // menu wrapper DOM reference

	onMount(() => {
		const handleOutsideClick = (event: any) => {
			if (show && !menu?.contains(event.target)) {
				show = false;
			}
		};

		const handleEscape = (event: any) => {
			if (show && event?.key === 'Escape') {
				show = false;
			}
		};

		// add events when element is added to the DOM
		document.addEventListener('click', handleOutsideClick, false);
		document.addEventListener('keyup', handleEscape, false);

		// remove events when element is removed from the DOM
		return () => {
			document.removeEventListener('click', handleOutsideClick, false);
			document.removeEventListener('keyup', handleEscape, false);
		};
	});
</script>

<div class="relative" bind:this={menu}>
	<div>
		<button
			on:click={() => (show = !show)}
			class="h-full flex items-center focus:outline-none focus:shadow-solid"
		>
			<slot name="button"></slot>
		</button>

		{#if show}
			<div
				in:scale={{ duration: 100, start: 0.95 }}
				out:scale={{ duration: 75, start: 0.95 }}
				class="origin-top-right absolute right-0 w-48 py-2 mt-1 bg-gray-100 dark:bg-gray-800 rounded shadow-md {$$props.class}"
			>
				<slot name="links"></slot>
			</div>
		{/if}
	</div>
</div>
