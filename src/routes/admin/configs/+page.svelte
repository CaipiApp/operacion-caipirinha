<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import { goto } from '$app/navigation';
	import MainCard from '$lib/components/MainCard.svelte';
	import { t } from '$lib/translate/i18n.js';
	export let data;

	$: columns = [
		{ label: $t('configurationsTableHeadersId'), key: 'id' },
		{ label: $t('configurationsTableHeadersKey'), key: 'key' },
		{ label: $t('configurationsTableHeadersValue'), key: 'value' },
		{ label: $t('configurationsTableHeadersDescription'), key: 'description' }
	];

	function renderColumns(key: string, obj: any) {
		if(key === 'description'){
			return obj[key] ? obj[key].substring(0, 50) + '...' : '--';
		}
		
		return obj[key] || '--';
	}

	function handleEdit(e: any) {
		const id = e?.detail?.data?.id;
		if (!id) return;

		goto(`/admin/configs/${id}`);
	}
</script>

<MainCard pages={[{ href: '/admin/cuentas', value: $t('configurationsBreadcrumb') }]}>
	<div class="flex mb-6">
		<button type="button" class="btn-bo uppercase" on:click={() => goto(`/admin/configs/nuevo`)}>
			<Add />
			<span>{$t('newConfigurationBtn')}</span>
		</button>
	</div>
	<Table
		{columns}
		data={data.configs}
		render={renderColumns}
		defaultActions={['edit']}
		on:edit={handleEdit}
	/>
</MainCard>
