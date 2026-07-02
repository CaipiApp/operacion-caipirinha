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
	import DetailsActionBtn from '$lib/components/buttons/DetailsActionBtn.svelte';

	export let data;

	$: columns = [
		{ label: $t('mantecaUsersTableHeadersId'), key: 'id' },
		{ label: $t('mantecaUsersTableHeadersUserId'), key: 'userId' },
		{ label: $t('mantecaUsersTableHeadersCuil'), key: 'cuil' },
		{ label: $t('mantecaUsersTableHeadersNames'), key: 'name' },
		{ label: $t('mantecaUsersTableHeadersEmail'), key: 'email' },
		{ label: $t('mantecaUsersTableHeadersType'), key: 'tipo' },
	];

	function renderColumns(key: string, obj: any) {
		
		return obj[key] || '';
	}

</script>

<MainCard pages={[{ href: '/admin/manteca/users', value: $t('mantecaUsersBreadcrumb') }]}>
	<div class="flex justify-end mb-6">
		<div class="grow max-w-md">
			<SearchInput placeholder={$t('mantecaUsersSearchPlaceholder')} />
		</div>
	</div>
	<Table
		{columns}
		data={data.pagadores}
		render={renderColumns}
		defaultActions={[]}
		orderCols={['id', 'userId', 'cuil', 'name']}
		actions={[
			{
				component: DetailsActionBtn,
				event: 'details'
			}
		]}
		on:details={(e) => goto(`/admin/manteca/users/${e?.detail?.data?.id}`)}
	/>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

