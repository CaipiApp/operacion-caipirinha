<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import type { EmpresaComision } from '$lib/models/empresaComision.model.js';
	import Modal from '$lib/components/Modal.svelte';
	import ComisionForm from '$lib/components/forms/ComisionForm.svelte';
	import { currency6 } from '$lib/utils.js';

	export let data;

	let showModalEdit = false;
	let comision: EmpresaComision | null = null;

	const columns = [
		{ label: 'ID', key: 'id' },
		{ label: 'Flujo', key: 'flujo' },
		{ label: 'Monto', key: 'monto' }
	];

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

<MainCard
	pages={[
		{ href: '/admin/empresas', value: 'Empresas' },
		{ href: `/admin/empresas/${data.empresa?.id}/comisiones`, value: `${data.empresa?.nombre} - comisiones` }
	]}
>
	<div class="flex justify-end mb-6">
		<div class="grow sm:max-w-md sm:w-fit w-full">
			<SearchInput placeholder="" />
		</div>
	</div>

	<Table
		{columns}
		data={data.empresa.comisiones}
		orderCols={['id', 'monto']}
		render={renderColumns}
		defaultActions={['edit']}
		on:edit={handleEdit}
	/>
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
