<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import type { InputType } from 'flowbite-svelte';

	export let type: InputType = 'text';
	export let name = '';
	export let id = '';
	export let placeholder = '';
	export let required = false;
	export let value = '';
	export let disabled = false;
	export let error = '';
	export let min = '';
	export let max = '';
	export let step = '1';
</script>

<Input
	{type}
	{name}
	{id}
	class={`!text-base 
${error ? 'placeholder-red-600 !border !border-red-600 focus:!ring-red-600' : ''}
`}
	{placeholder}
	{required}
	bind:value
	{disabled}
	{min}
	{max}
	{step}
	on:change
/>
{#if error}
	<p class="mt-2 text-sm text-red-600">
		{error}
	</p>
{/if}
