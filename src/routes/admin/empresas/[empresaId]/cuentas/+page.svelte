<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';

	export let data;

	const columns = [
		{ label: 'ID', key: 'id' },
		{ label: 'Tipo', key: 'tipo' },
		{ label: 'Chave', key: 'clave' }
	];

	function renderColumns(key: string, obj: any) {
		return obj[key] || '--';
	}
</script>

<MainCard
	pages={[
		{ href: '/admin/empresas', value: 'Empresas' },
		{
			href: `/admin/empresas/${data.empresa?.id}/cuentas`,
			value: `${data.empresa?.nombre} - Contas`
		}
	]}
>
	<div class="flex justify-end mb-6">
		<div class="grow sm:max-w-md sm:w-fit w-full">
			<SearchInput placeholder="Pesquisar por tipo ou chave" />
		</div>
	</div>

	<Table
		{columns}
		data={data.cuentas}
		orderCols={['id', 'clave']}
		render={renderColumns}
		defaultActions={[]}
	/>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>
