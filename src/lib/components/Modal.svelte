<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/translate/i18n';
	import { Button } from 'flowbite-svelte';
	import Caipi from './Icons/Caipi.svelte';

	export let show = false;
	export let title = '';

	export let btnOk = true;
	export let btnCancel = true;

	const dispatch = createEventDispatcher();
</script>

<!-- Main modal -->
<div
	id="default-modal"
	tabindex="-1"
	aria-hidden={show}
	class:hidden={!show}
	class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
>
	<div class="relative p-4 w-full max-w-4xl max-h-full">
		<!-- Modal content -->
		<div class="relative rounded-lg shadow bg-gray-100 dark:bg-gray-700">
			<!-- Modal header -->
			<div
				class="grid grid-cols-2 relative items-center justify-between w-full p-4 md:p-5 border-b rounded-t border-gray-600"
			>
				<h3 class="sm:text-xl text-md font-popMedium text-gray-900 dark:text-white mr-12">
					{title}
				</h3>

				<Caipi
					class="w-20 absolute left-1/2 -translate-x-1/2 dark:text-white text-primary-400 dark:text-white-500"
				/>
				<div class=" flex items-center ml-12">
					<button
						type="button"
						class="text-gray-400 bg-transparent ml-auto rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 hover:bg-primary-600 hover:text-white"
						data-modal-hide="default-modal"
						on:click={() => (show = false)}
					>
						<svg
							class="w-3 h-3"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 14"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
							/>
						</svg>
						<span class="sr-only">Fechar</span>
					</button>
				</div>
			</div>
			<!-- Modal body -->
			<div class="p-4 md:p-5 space-y-4">
				<slot></slot>
			</div>
			<!-- Modal footer -->
			<div class="flex items-center p-4 md:p-5 border-t rounded-b border-gray-600">
				{#if btnOk}
					<Button
						data-modal-hide="default-modal"
						type="button"
						color="primary"
						on:click={() => {
							show = false;
							dispatch('confirm');
						}}
					>
						{$t('modalAcceptBtn')}
					</Button>
				{/if}
				{#if btnCancel}
					<Button
						data-modal-hide="default-modal"
						type="button"
						on:click={() => {
							show = false;
							dispatch('cancel');
						}}
					>
						{$t('modalCancelBtn')}
					</Button>
				{/if}
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</div>
