<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import EditActionBtn from './buttons/EditActionBtn.svelte';
	import DeleteActionBtn from './buttons/DeleteActionBtn.svelte';
	import SortBtn from '$lib/components/SortBtn.svelte';
	import { t } from '$lib/translate/i18n';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let columns: Record<string, string>[] = [];
	export let orderCols: string[] = [];
	export let data: any;
	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit', 'delete'];

	const dispatch = createEventDispatcher();

	$: headers = columns?.map((col: Record<string, string>) => col.label);
	$: keys = columns?.map((col: Record<string, string>) => col.key);
	$: showActions = defaultActions?.length + actions?.length > 0;
</script>

<div
	class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-300 dark:border-gray-600"
>
	<Table striped={true}>
		<TableHead>
			{#each headers as label, i}
				<TableHeadCell>
					{#if orderCols.includes(keys[i])}
						<SortBtn key={keys[i]} {label} />
					{:else}
						{label}
					{/if}
				</TableHeadCell>
			{/each}
			{#if showActions}
				<TableHeadCell scope="col" class="px-6 py-3">
					{actions?.[0]?.event === 'viewLink' ? 'Link' : $t('accountsTableActions')}
				</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody>
			{#each data as obj}
				<TableBodyRow>
					{#each keys as key}
						<TableBodyCell>
							{render(key, obj)}
						</TableBodyCell>
					{/each}
					{#if showActions}
						<TableBodyCell>
							<div class="flex gap-3">
								{#each actions as action}
									<svelte:component
										this={action.component}
										on:click={() => dispatch(action.event, { data: obj })}
										{...action.props}
									/>
								{/each}
								{#if defaultActions.includes('edit')}
									<EditActionBtn
										text={$t('tableActionsEdit')}
										on:click={() => dispatch('edit', { data: obj })}
									/>
								{/if}
								{#if defaultActions.includes('delete')}
									<DeleteActionBtn
										text={$t('tableActionsDelete')}
										on:click={() => {
											dispatch('delete', { data: obj });
										}}
									/>
								{/if}
							</div>
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	{#if data.length === 0}
		<p class="p-4 text-center font-popLight text-white uppercase">{$t('tableNoData')}</p>
	{/if}
</div>
