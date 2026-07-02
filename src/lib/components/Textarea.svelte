<script lang="ts">
	export let name = '';
	export let id = '';
	export let placeholder = '';
	export let required = false;
	export let value = '';
	export let rows = 4;
	export let error = '';
</script>

<textarea
	{id}
	{name}
	{rows}
	class="block p-2.5 w-full text-sm rounded-lg bg-gray-700 focus:outline-none focus:ring {error
		? 'text-red-500 placeholder-red-500 border border-red-500 focus:ring-red-500'
		: 'placeholder-gray-400 text-white focus:ring-secondary'} sm:text-sm rounded-lg block w-full p-2.5 {$$props.class ||
		''}"
	{placeholder}
	{required}
>
	{value}
</textarea>

{#if error}
	<p class="mt-2 text-sm text-red-500">
		{error}
	</p>
{/if}
