<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import { t } from '$lib/translate/i18n.js';
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import DetailsActionBtn from '$lib/components/buttons/DetailsActionBtn.svelte';
	import { currency2 } from '$lib/utils.js';


	dayjs.extend(customParseFormat);

	export let data;

	let showFilters = false;

	$: columns = [
		{ label: "ID", key: 'id' },
		{ label: "Fecha", key: 'createdAt' },
		{ label: "Monto", key: 'montoDestino' },
		{ label: "Tipo", key: 'tipo' },
		{ label: "Estado", key: 'estado' },
	];

	// Columns that can be ordered
	const orderCols = ['id', 'createdAt', 'montoDestino'];

	function renderColumns(key: string, obj: any) {
		if (key === 'createdAt') {
			return dayjs(obj[key]).format('DD/MM/YYYY HH:mm');
		}

		if(key === 'montoDestino'){
			return `${currency2(obj[key]).format()} ${obj.monedaDestino}`
		}

		if (key === 'estado') {
			if(obj?.pagoLink) return obj?.pagoLink?.estado;
			if(obj?.pagoQr) return obj?.pagoQr?.estado;
			return '--'
		}

		if(key === 'tipo'){
			if(obj.pagoLink) return "LINK";
			if(obj.pagoQr) return "QR";

			return '--'
		}

		return obj[key] || '--';
	}

</script>

<MainCard pages={[{ href: '/admin/pagos', value: "pagos" }]}>
	<div class="flex justify-end mb-6 md:flex-row flex-col gap-6">
		<Button
			color="alternative"
			type="button"
			class="uppercase w-full md:w-fit"
			on:click={() => (showFilters = !showFilters)}
		>
			{showFilters ? $t('hideFilters') : $t('showFilters')}
		</Button>
	</div>
	{#if showFilters}
		<div class="flex mb-6 justify-between flex-col gap-6">
			<div class="grow w-full responsive-flex gap-4 items-start">
				<div class="flex flex-col gap-4 w-full md:max-w-md">
					<SearchInput placeholder={"buscar por uuid o qr"} />
				</div>
			</div>
		</div>
	{/if}

	
	<!-- svelte-ignore missing-declaration -->
	<Table
		{columns}
		data={data.pagos}
		render={renderColumns}
		{orderCols}
		defaultActions={[]}
		actions={[
			{
				component: DetailsActionBtn,
				event: 'details'
			}
		]}
		on:details={(e) => goto(`/admin/pagos/${e?.detail?.data?.id}`)}
	/>
	

	<Pagination {...data.meta} class="mt-3" />
</MainCard>


<style>
	.responsive-flex {
		display: flex;
	}

	@media (max-width: 870px) {
		.responsive-flex {
			flex-direction: column;
		}
		.justify-end {
			justify-content: flex-start;
		}
	}
</style>
