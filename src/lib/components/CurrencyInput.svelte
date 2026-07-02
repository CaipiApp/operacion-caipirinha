<script lang="ts">
	import CurrencyInput from '@canutin/svelte-currency-input';
	export let name = '';
	export let isNegativeAllowed = false;
	export let placeholder = '';
	export let required = false;
	export let value = 0;
	export let fractionDigits = 2;
	export let onValueChangeFunction = (value: any): void => {};
  export let error: string | undefined = undefined;
</script>

<CurrencyInput
	{name}
	{isNegativeAllowed}
	{placeholder}
	{required}
	bind:value
	{fractionDigits}
	currency="ARS"
	onValueChange={onValueChangeFunction}
	locale="es-AR"
	inputClasses={{
		formatted: `block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600  rounded-lg
		${error && 'placeholder-red-600 !border !border-red-600 focus:!ring-red-600'} `
	}}
/>
{#if error}
	<p class="mt-2 text-sm text-red-600">
		{error}
	</p>
{/if}
