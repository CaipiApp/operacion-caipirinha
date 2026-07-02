<script lang="ts">
	import Edit from '../Icons/Edit.svelte';

	export let type: 'button' | 'reset' | 'submit' | undefined | null = 'button';

	export let text: string;
	export let width = '24px';
	export let height = '24px';
</script>

<span class="tooltip">
	<button {type} class="text-yellow-500" on:click>
		<Edit {width} {height} />
	</button>
	<span class="tooltiptext">{text}</span>
</span>
