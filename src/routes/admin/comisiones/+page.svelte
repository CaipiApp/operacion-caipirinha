<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import Cards from '$lib/components/Cards.svelte';
	import { Heading } from 'flowbite-svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ComisionForm from '$lib/components/forms/ComisionForm.svelte';
	import type { Comision } from '$lib/models';
	import { currency6 } from '$lib/utils.js';

	export let data;

	let showModalEdit = false;
	let comision: Comision | null = null;

	$: columns = [
		{ label: 'ID', key: 'id' },
		{ label: 'FLUJO', key: 'flujo' },
		{label: 'monto', key: 'monto'},
		
	];

	const orderCols = ['id', 'monto'];

	function renderColumns(key: string, obj: any) {
		if(key === 'monto') return currency6(obj[key]).format();
		
		return obj[key] || '--';
	}

	function handleEdit(e: any) {
		if (!e?.detail?.data){
			comision = null;
			return;
		}

		comision = e?.detail?.data;
		showModalEdit = true;
	}

</script>

<MainCard pages={[{ href: '/admin/comiciones', value: 'comisiones' }]}>
	<div class="mb-8">
		<Heading tag="h6" class="mb-8">Comisiones caipi app</Heading>
	
		<div class="hidden md:block">
			<Table
				columns={columns}
				data={data.comisiones}
				{orderCols}
				render={renderColumns}
				on:edit={handleEdit}
				defaultActions={['edit']}
			/>
		</div>
		<div class="md:hidden block">
			<Cards
				columns={columns}
				data={data.comisiones}
				render={renderColumns}
				on:edit={handleEdit}
				defaultActions={['edit']}
			/>
		</div>
	
		<Pagination {...data.meta} class="mt-3 md:mt-6" />
	</div>
	
</MainCard>

{#key comision}
	{#if comision}
		<Modal bind:show={showModalEdit}>
			<div class="flex">
				<ComisionForm id={comision?.id} flujo={comision?.flujo} monto={comision?.monto} formAction="?/update" bind:showModal={showModalEdit} />
			</div>
		</Modal>
	{/if}
{/key}

