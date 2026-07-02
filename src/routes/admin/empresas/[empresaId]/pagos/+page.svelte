<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import ViewLinkActionBtn from '$lib/components/buttons/ViewLinkActionBtn.svelte';
	import LinkBlock from '$lib/components/LinkBlock.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import dayjs from 'dayjs';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;

	let pago: any;
	let showLink = false;

	const columns = [
		{ label: 'ID', key: 'id' },
		{ label: 'Data', key: 'createdAt' },
		{ label: 'Estado', key: 'estado' },
		{ label: 'Moeda a receber', key: 'monedaDestino' },
		{ label: 'Valor a receber', key: 'montoDestino' },
		{ label: 'Moeda Origem', key: 'monedaOrigen' },
		{ label: 'Conta', key: 'cuenta' },
		{ label: 'Data de Expiração', key: 'expiratedAt' }
	];

	function renderColumns(key: string, obj: any) {
		if (key === 'cuenta') {
			return obj[key]?.['clave'] || '--';
		}

		if (key === 'createdAt') {
			return dayjs(obj[key]).format('DD/MM/YYYY HH:mm');
		}

		return obj[key] || '--';
	}

	function handleViewLink(e: any) {
		pago = e?.detail?.data;
		if (!pago) return;
		showLink = true;
	}
</script>

<MainCard
	pages={[
		{ href: '/admin/empresas', value: 'Empresas' },
		{ href: `/admin/empresas/${data.empresa?.id}/pagos`, value: `${data.empresa?.nombre} - Pagos` }
	]}
>
	<Table
		{columns}
		data={data.pagos}
		render={renderColumns}
		orderCols={['id', 'createdAt', 'montoDestino']}
		defaultActions={[]}
		actions={[
			{
				component: ViewLinkActionBtn,
				event: 'viewLink'
			}
		]}
		on:viewLink={handleViewLink}
	/>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

<Modal bind:show={showLink} title="Link de Pagamento" btnCancel={false}>
	<div class="flex justify-center">
		{#if showLink}<LinkBlock {pago} />{/if}
	</div>
</Modal>
