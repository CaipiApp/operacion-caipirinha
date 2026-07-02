<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import MainCard from '$lib/components/MainCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import { t } from '$lib/translate/i18n.js';

	export let data;

	let showConfirmDelete = false;
	let deleteForm: HTMLFormElement | null = null;
	let deleteUser: any = null;

	$: columns = [
		{ label: $t('usersTableHeadersId'), key: 'id' },
		{ label: $t('usersTableHeadersEmail'), key: 'email' },
		{ label: $t('usersTableHeadersNames'), key: 'name' },
		{ label: $t('usersTableHeadersRoles'), key: 'roles' }
	];

	function renderColumns(key: string, obj: any) {
		if (key === 'roles') return obj[key]?.map((rol: any) => rol.nombre)?.join(',') || '';

		return obj[key] || '';
	}

	function handleEdit(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/users/${id}`);
	}

	function showDeleteConfirmation(e: any) {
		deleteUser = e?.detail?.data;
		if (!deleteUser) return;
		showConfirmDelete = true;
	}

	const handleDelete = () => {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				toast.success($t('usersDeleteSuccess'));
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<MainCard pages={[{ href: '/admin/users', value: $t('usersBreadcrumb') }]}>
	<div class="flex justify-between mb-6">
		<button type="button" class="btn-bo uppercase" on:click={() => goto(`/admin/users/new`)}>
			<Add />
			<span>{$t('newUserBtn')}</span>
		</button>
		<div class="grow max-w-md">
			<SearchInput placeholder={$t('usersSearchPlaceholder')} />
		</div>
	</div>
	<Table
		{columns}
		data={data.users}
		render={renderColumns}
		orderCols={['id', 'email']}
		on:edit={handleEdit}
		on:delete={showDeleteConfirmation}
	/>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

<form
	method="POST"
	action="?/delete"
	class="hidden"
	bind:this={deleteForm}
	use:enhance={handleDelete}
>
	<input name="deletedId" value={deleteUser?.id} type="hidden" />
</form>

<Modal
	bind:show={showConfirmDelete}
	title={$t('usersDeleteModalTitle')}
	on:confirm={() => deleteForm?.requestSubmit()}
	on:cancel={(deleteUser = null)}
>
	<p class="text-base leading-relaxed text-gray-400">
		{$t('usersDeleteModalTitle')}
		{deleteUser?.email}?
	</p>
</Modal>
