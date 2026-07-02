<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import { t } from '$lib/translate/i18n.js';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import MainCard from '$lib/components/MainCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import Cards from '$lib/components/Cards.svelte';
	import SortInput from '$lib/components/SortInput.svelte';
	import { A, Button, Heading, Label, P } from 'flowbite-svelte';

	export let data;

	let showFilters = false;
	let showConfirmDelete = false;
	let deleteForm: HTMLFormElement | null = null;
	let deleteCuenta: any = null;

	$: columnsBRL = [
		{ label: $t('accountsTableHeadersId'), key: 'id' },
		{ label: $t('accountsTableHeadersType'), key: 'tipo' },
		{label: 'CPF/CNPJ', key: 'documentNumber'},
		{ label: $t('accountsTableHeadersKey'), key: 'clave' }
	];

	$: columnsARS = [
		{ label: $t("accountsARSTableHeaderBank"), key: 'bankName' },
		{ label: "cbu", key: 'cbu' },
	];

	const orderCols = ['id', 'clave'];

	function renderColumns(key: string, obj: any) {
		return obj[key] || '--';
	}

	function handleEdit(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/cuentas/${id}`);
	}

	function showDeleteConfirmation(e: any) {
		deleteCuenta = e?.detail?.data;
		if (!deleteCuenta) return;
		showConfirmDelete = true;
	}

	const handleDelete = () => {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				toast.success($t(result.data?.message));
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

	$: verificado = data?.empresa?.pagadores?.[0]?.verificado;
	$: cuentas = data.empresa?.pagadores?.[0]?.cuentas || [];

	$: {
		if(data.flashMessage){
			if(data.flashMessage.type === "success"){
				toast.success(data.flashMessage.message)
			}else{
				toast.error(data.flashMessage.message);
			}
		}
	}

</script>

<MainCard pages={[{ href: '/admin/cuentas', value: $t('accountsBreadcrumb') }]}>
	<div class="mb-8">
		<Heading tag="h6" class="mb-8">{$t('accountsTypeBrl')} <img src="/images/landing/pt.png" alt="" class="w-4 h-4" /></Heading>

		<div class="flex flex-col gap-6 mb-6">
			<div class="flex justify-between sm:flex-row flex-col gap-6">
				<button
					type="button"
					class="flex justify-center items-center gap-2 uppercase btn-bo"
					on:click={() => goto(`/admin/cuentas/nuevo`)}
				>
					<Add />
					<span>{$t('newAccountBtn')}</span>
				</button>
				<Button
					color="alternative"
					type="button"
					class="uppercase"
					on:click={() => (showFilters = !showFilters)}
				>
					{showFilters ? $t('hideFilters') : $t('showFilters')}
				</Button>
			</div>
			{#if showFilters}
				<div class="flex gap-6 items-end sm:flex-row flex-col">
					<div class="md:hidden w-full">
						<SortInput {orderCols} columns={columnsBRL} />
					</div>
					<div class="w-full md:max-w-md">
						<Label class="font-popMedium mb-2">{$t('filterLabel')}</Label>
						<SearchInput placeholder={$t('accountsSearchPlaceholder')} />
					</div>
				</div>
			{/if}
		</div>

	
		<div class="hidden md:block">
			<Table
				columns={columnsBRL}
				data={data.cuentas}
				{orderCols}
				render={renderColumns}
				on:edit={handleEdit}
				on:delete={showDeleteConfirmation}
			/>
		</div>
		<div class="md:hidden block">
			<Cards
				columns={columnsBRL}
				data={data.cuentas}
				render={renderColumns}
				on:edit={handleEdit}
				on:delete={showDeleteConfirmation}
			/>
		</div>
	
		<Pagination {...data.meta} class="mt-3 md:mt-6" />
	</div>
	<div>
		<Heading tag="h6" class="mb-8">{$t('accountsTypeArs')} <img src="/images/landing/es.png" alt="" class="w-4 h-4" /></Heading>

		{#if !verificado}
			<button
				type="button"
				class="flex justify-center items-center gap-2 uppercase btn-bo"
				on:click={() => goto(`/registro?redirect_to=/admin/cuentas`)}
			>
				<Add />
				<span>{$t('newAccountBtn')}</span>
			</button>
			<P class="text-center">{$t('accountsCompanyNotVerified')}:</P>
			<P class="text-center">
				<A href="/registro?redirect_to=/admin/cuentas">{$t('accountsCompanyRegister')}</A>
			</P>
		{:else}

			<Table
				columns={columnsARS}
				data={cuentas}
				render={renderColumns}
				defaultActions={[]}
			/>
		{/if}
	</div>
	
</MainCard>

<form
	method="POST"
	action="?/delete"
	class="hidden"
	bind:this={deleteForm}
	use:enhance={handleDelete}
>
	<input name="deletedId" value={deleteCuenta?.id} type="hidden" />
</form>

<Modal
	bind:show={showConfirmDelete}
	title={$t('modalDeleteTitle')}
	on:confirm={() => deleteForm?.requestSubmit()}
	on:cancel={(deleteCuenta = null)}
>
	<p class="text-base leading-relaxed text-gray-400">
		{$t('modalDeleteTitle')}: {deleteCuenta?.tipo}?
	</p>
</Modal>
