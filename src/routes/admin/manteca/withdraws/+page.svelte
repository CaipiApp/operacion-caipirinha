<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';

	export let data;

	$: columns = [
		{ label: "Fecha", key: 'creationTime' },
		{ label: "Monto", key: 'amount' },
		{ label: "Usuario", key: 'name' },
		{ label: "ID", key: 'numberId' },
		{ label: "Estado", key: 'status' },
		{ label: "CBU", key: 'cbu' },
		{ label: "Banco", key: 'bank' },
	];

	function renderColumns(key: string, obj: any) {
		if(key === 'creationTime') return new Date(obj[key]).toLocaleDateString();
		if(key === 'amount') return `$${parseFloat(obj[key]).toFixed(2)} ARS`;
		if(key === 'name' || key === 'numberId') return obj?.user?.[key];
		if(key === 'cbu') return obj?.destAccount?.cbu;

		return obj[key] || '';

	}

</script>

<MainCard pages={[{ href: '/admin/manteca/withdraws', value: 'Manteca - Retiros' }]}>
	<div class="flex justify-end mb-6">
		<div class="grow max-w-md">
			<SearchInput placeholder="Filtrar por Id" />
		</div>
	</div>

	<Table
		{columns}
		data={data.retiros}
		render={renderColumns}
		defaultActions={[]}
	/>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

