<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Select from 'svelte-select';
	import { t } from '$lib/translate/i18n';
	import { Label } from 'flowbite-svelte';

	export let columns: Record<string, string>[] = [];
	export let orderCols: string[];

	let order = $page.url.searchParams.get('order');
	let direction = $page.url.searchParams.get('direction');

	function translateOrdering(order: string): string {
		const column = columns.find((col) => col.key === order);
		if (column) return column.label;

		return order;
	}

	let orderOpts: Record<string, string>[];
	$: if (columns !== undefined) {
		orderOpts = orderCols?.flatMap((order) => {
			return ['asc', 'desc'].map((direc) => {
				return { label: `${translateOrdering(order)} ${direc}`, value: `${order} ${direc}` };
			});
		});
	}

	$: ordering = order
		? {
				label: `${translateOrdering(order)} ${direction}`,
				value: `${order} ${direction}`
			}
		: undefined;

	function ordenar() {
		if (!ordering) return;
		const split = ordering.value.split(' ');
		$page.url.searchParams.set('page', '1');
		$page.url.searchParams.set('order', split[0]);
		$page.url.searchParams.set('direction', split[1]);
		goto(`${$page.url.pathname}?${$page.url.searchParams}`, {
			replaceState: true,
			invalidateAll: true
		});
	}
	function clear() {
		$page.url.searchParams.delete('page');
		$page.url.searchParams.delete('order');
		$page.url.searchParams.delete('direction');
		goto(`${$page.url.pathname}?${$page.url.searchParams}`, {
			replaceState: true,
			invalidateAll: true
		});
	}
</script>

<Label forId="ordenar" class="mb-2 font-popMedium">{$t('orderLabel')}</Label>

<Select
	class=" dark-select {$page.form?.errors?.cuentaId ? 'select-invalid' : ''} w-full sm:w-auto "
	items={orderOpts}
	bind:value={ordering}
	name="ordenar"
	placeholder={$t('orderPlaceholder')}
	on:change={() => ordenar()}
	on:clear={() => clear()}
/>
