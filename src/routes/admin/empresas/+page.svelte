<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AccountActionBtn from '$lib/components/buttons/AccountActionBtn.svelte';
	import PayoutActionBtn from '$lib/components/buttons/PayoutActionBtn.svelte';

	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import MainCard from '$lib/components/MainCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import { t } from '$lib/translate/i18n.js';
	import ComisionActionBtn from '$lib/components/buttons/ComisionActionBtn.svelte';
	export let data;

	let showConfirmDelete = false;
	let deleteForm: HTMLFormElement | null = null;
	let deleteEmpresa: any = null;

	const columns = [
		{ label: $t('enterprisesTableHeadersId'), key: 'id' },
		{ label: $t('enterprisesTableHeadersName'), key: 'nombre' },
		{ label: $t('enterprisesTableHeadersTelephone'), key: 'telefono' },
		{ label: $t('enterprisesTableHeadersAddress'), key: 'direccion' }
	];

	function renderColumns(key: string, obj: any) {
		return obj[key] || '--';
	}

	function handleEdit(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/empresas/${id}`);
	}

	function handleAccounts(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/empresas/${id}/cuentas`);
	}

	function handleComisiones(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/empresas/${id}/comisiones`);
	}

	function handlePayouts(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/empresas/${id}/pagos`);
	}

	function showDeleteConfirmation(e: any) {
		deleteEmpresa = e?.detail?.data;
		if (!deleteEmpresa) return;
		showConfirmDelete = true;
	}

	const handleDelete = () => {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				toast.success($t('enterprisesDeleteSuccess'));
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<MainCard pages={[{ href: '/admin/empresas', value: $t('enterprisesBreadcrumb') }]}>
	<div class="flex justify-between mb-6 sm:flex-row flex-col gap-6">
		<button type="button" class="btn-bo uppercase" on:click={() => goto(`/admin/empresas/new`)}>
			<Add />
			<span>{$t('newEnterpriseBtn')}</span>
		</button>
		<div class="grow sm:max-w-md sm:w-fit w-full">
			<SearchInput placeholder={$t('enterprisesSearchPlaceholder')} />
		</div>
	</div>

	<Table
		{columns}
		data={data.empresas}
		render={renderColumns}
		orderCols={['id', 'nombre']}
		actions={[
			{
				component: ComisionActionBtn,
				event: 'gotoComision'
			},
			{
				component: AccountActionBtn,
				event: 'gotoAccounts'
			},
			{
				component: PayoutActionBtn,
				event: 'gotoPayouts'
			}
		]}
		on:edit={handleEdit}
		on:delete={showDeleteConfirmation}
		on:gotoAccounts={handleAccounts}
		on:gotoPayouts={handlePayouts}
		on:gotoComision={handleComisiones}
	></Table>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

<form
	method="POST"
	action="?/delete"
	class="hidden"
	bind:this={deleteForm}
	use:enhance={handleDelete}
>
	<input name="deletedId" value={deleteEmpresa?.id} type="hidden" />
</form>

<Modal
	bind:show={showConfirmDelete}
	title={$t('enterprisesDeleteModalTitle')}
	on:confirm={() => deleteForm?.requestSubmit()}
	on:cancel={(deleteEmpresa = null)}
>
	<p class="text-base leading-relaxed text-gray-400">
		{$t('enterprisesDeleteModalSubtitle')}
		{deleteEmpresa?.nombre}?
	</p>
</Modal>
