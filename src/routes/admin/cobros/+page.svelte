<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import { goto } from '$app/navigation';
	import MainCard from '$lib/components/MainCard.svelte';
	import ViewLinkActionBtn from '$lib/components/buttons/ViewLinkActionBtn.svelte';
	import LinkBlock from '$lib/components/LinkBlock.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import Cards from '$lib/components/Cards.svelte';
	import SortInput from '$lib/components/SortInput.svelte';
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat.js';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import EstadoFilter from '$lib/components/EstadoFilter.svelte';
	import { currency2, translatePaymentState } from '$lib/utils.js';
	import DateFilter from '$lib/components/DateFilter.svelte';
	import ExportDataBtn from '$lib/components/ExportDataBtn.svelte';
	import { t } from '$lib/translate/i18n.js';
	import { Button } from 'flowbite-svelte';
	import type { Pago } from '$lib/models/pago.model.js';
	import { EstadoPagoQr } from '$lib/models/enums.js';

	dayjs.extend(customParseFormat);

	export let data;

	let pago: any;
	let showLink = false;
	let showFilters = false;

	$: columns = [
		{ label: $t('paymentsTableHeadersId'), key: 'id' },
		{ label: $t('paymentsTableHeadersEstado'), key: 'estado' },
		{ label: $t('paymentsTableHeadersMontoDestino'), key: 'montoDestino' },
		{ label: $t('paymentsTableHeadersMonedaDestino'), key: 'monedaDestino' },
		{ label: $t('paymentsTableHeadersCreatedAt'), key: 'createdAt' },	
		{ label: $t('paymentsTableHeadersCliente'), key: 'cliente' },
		{ label: $t('paymentsTableHeadersConc'), key: 'concepto' },
		{ label: $t('paymentsTableHeadersRef'), key: 'ref' },
	];

	// Columns that can be ordered
	const orderCols = ['id', 'createdAt', 'montoDestino'];

	function renderColumns(key: string, obj: Pago) {
		if (key === 'createdAt') {
			return dayjs(obj[key]).format('DD/MM/YYYY HH:mm');
		}

		if (key === 'estado') {
			if(obj.pagoQr && obj.pagoQr.estado === EstadoPagoQr.proceso && obj.pagoQr.expires <= dayjs().unix()){	
      	return $t('newPaymentModalStatusExpired')
    	}
			
			return $t(translatePaymentState(obj[key]));
		}

		if(key === 'cliente'){
			if(obj.pagoLink) return obj?.pagoLink?.refNombreCliente || '--';
			if(obj.pagoQr) return obj?.pagoQr?.pagadorPix?.email || '--';

			return '--'
		}

		if(key === 'ref'){
			if(obj.pagoLink) return obj?.pagoLink?.refCodigo || '--';
			if(obj.pagoQr) return obj?.pagoQr?.referencia || '--';

			return '--'
		}

		if(key === 'concepto'){
			if(obj.pagoLink) return obj?.pagoLink?.refConcepto || '--';
			if(obj.pagoQr) return obj?.pagoQr?.concepto || '--';

			return '--'
		}

		if(key === 'montoDestino'){
			return `${currency2(obj.montoDestino).format()} ${obj.monedaDestino}`
		}

		return obj[key as keyof Pago] || '--';
	}

	function handleViewLink(e: any) {
		pago = e?.detail?.data;
		if (!pago) return;
		showLink = true;
	}

</script>

<MainCard pages={[{ href: '/admin/cobros', value: $t('paymentsBreadcrumb') }]}>
	<div class="flex justify-between mb-6 md:flex-row flex-col gap-6">
		<Button
			color="primary"
			type="button"
			class="flex justify-center items-center gap-2 uppercase w-full md:w-auto"
			on:click={() => goto(`/admin/cobros/nuevo`)}
		>
			<Add />
			<span>{$t('newPaymentBtn')}</span>
		</Button>
		<div class="inline-flex grow md:justify-end gap-4 sm:flex-row flex-col-reverse">
			<Button
				color="alternative"
				type="button"
				class="uppercase w-full md:w-fit"
				on:click={() => (showFilters = !showFilters)}
			>
				{showFilters ? $t('hideFilters') : $t('showFilters')}
			</Button>

			<ExportDataBtn render={renderColumns} {columns} />
		</div>
	</div>
	{#if showFilters}
		<div class="flex mb-6 justify-between flex-col gap-6">
			<div class="grow w-full responsive-flex gap-4 items-start">
				<div class="flex flex-col gap-4 w-full md:max-w-md">
					<div class="md:hidden">
						<SortInput {orderCols} {columns} />
					</div>

					<div class="md:hidden -mb-2 text-white">
						<p class="text-gray-900 dark:text-gray-300 text-sm font-popMedium">
							{$t('filterLabel')}
						</p>
					</div>

					<SearchInput placeholder={$t('paymentsSearchPlaceholder')} />

					<EstadoFilter />
				</div>

				<div class="flex gap-4 md:flex-row flex-col w-full justify-end">
					<DateFilter />
				</div>
			</div>
		</div>
	{/if}

	<div class="hidden md:block">
		<Table
			{columns}
			data={data.pagos}
			render={renderColumns}
			{orderCols}
			defaultActions={[]}
			actions={[
				{
					component: ViewLinkActionBtn,
					event: 'viewLink'
				}
			]}
			on:viewLink={handleViewLink}
		/>
	</div>
	<div class="md:hidden block">
		<Cards
			{columns}
			data={data.pagos}
			render={renderColumns}
			defaultActions={[]}
			actions={[
				{
					component: ViewLinkActionBtn,
					event: 'viewLink'
				}
			]}
			on:viewLink={handleViewLink}
		/>
	</div>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

<Modal bind:show={showLink} title={$t('modalPaymentLinkTitle')} btnCancel={false}>
	<div class="flex justify-center">
		{#if showLink}<LinkBlock {pago} />{/if}
	</div>
</Modal>

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
