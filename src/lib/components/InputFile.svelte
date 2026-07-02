<script>
	export let name = '';
	export let id = '';
	export let placeholder = '';
	export let required = false;
	export let disabled = false;
	export let error = '';
	export let accept = '';
	export let inputRef = null;
</script>

<input
	class="flex flex-col w-full border rounded-lg cursor-pointer text-gray-400 bg-gray-700 border-gray-600 placeholder-gray-400
focus:outline-none focus:ring {error
		? 'text-red-500 placeholder-red-500 border border-red-500 focus:ring-red-500'
		: 'placeholder-gray-400 text-white focus:ring-secondary'}
"
	type="file"
	{name}
	{id}
	{placeholder}
	{required}
	{disabled}
	{accept}
	bind:this={inputRef}
/>

{#if error}
	<p class="mt-2 text-sm text-red-500">
		{error}
	</p>
{/if}

<style>
	input::file-selector-button {
		padding: 5px;
		margin-right: 0.625rem;
	}
</style>
