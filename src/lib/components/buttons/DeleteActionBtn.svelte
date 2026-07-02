<script lang="ts">
	import Delete from '../Icons/Delete.svelte';

	export let text: string;
</script>

<span class="tooltip">
	<button class="text-white dark:text-gray-800" on:click>
		<Delete />
	</button>
	<span class="tooltiptext">{text}</span>
</span>
