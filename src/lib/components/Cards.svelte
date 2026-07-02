<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import EditActionBtn from './buttons/EditActionBtn.svelte';
	import DeleteActionBtn from './buttons/DeleteActionBtn.svelte';
	import { t } from '$lib/translate/i18n';

	export let columns: Record<string, string>[] = [];
	export let data: any;
	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit', 'delete'];

	const dispatch = createEventDispatcher();

	$: headers = columns?.map((col: any) => col.label);
	$: keys = columns?.map((col: any) => col.key);
	$: showActions = defaultActions?.length + actions?.length > 0;
</script>

<div class="flex flex-col gap-4 ellipsis">
	{#if data.length === 0}
		<p class="p-4 text-center font-popLight text-white">SEM DADOS</p>
	{/if}
	{#each data as obj}
		<div
			class="text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-3xl py-7 overflow-hidden"
		>
			{#each headers as header, i}
				<div
					class="grid grid-cols-2 odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 px-2 py-1 [&>*:col-span-1]"
				>
					<p class="font-popMedium ellipsis">{header}</p>
					<p>{render(keys[i], obj)}</p>
				</div>
			{/each}
			{#if showActions}
				<div
					class:dark:bg-gray-900={headers.length % 2 === 0}
					class:bg-white={headers.length % 2 === 0}
					class="grid grid-cols-2 items-center px-2 py-1 [&>*:col-span-1]"
				>
					<p class="font-popMedium">
						{actions?.[0]?.event === 'viewLink' ? 'Link' : $t('accountsTableActions')}
					</p>
					<div class="flex items-center gap-6">
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
								on:click={() => dispatch('delete', { data: obj })}
							/>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
