<script lang="ts">
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
	export let sufix = '';
</script>

<div class="relative">
	<input
		{type}
		{name}
		{id}
		class={`
		block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600  rounded-lg
		${error ? 'placeholder-red-600 !border !border-red-600 focus:!ring-red-600' : ''} `}
		{placeholder}
		{required}
		{value}
		{disabled}
		{min}
		{max}
		{step}
		on:change
		on:wheel
		on:input
	/>
	{#if sufix}
		<span class="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-400">
			{sufix}
		</span>
	{/if}
</div>
{#if error}
	<p class="mt-2 text-sm text-red-600">
		{error}
	</p>
{/if}
