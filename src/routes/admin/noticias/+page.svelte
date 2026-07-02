<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import MainCard from '$lib/components/MainCard.svelte';
	import { t } from '$lib/translate/i18n.js';

	export let data;

	// open create page instead of modal

	const columns = [
		{ label: $t('noticiasTableHeadersId'), key: 'id' },
		{ label: $t('noticiasTableHeadersTitle'), key: 'titulo' },
		{ label: $t('noticiasTableHeadersDescription'), key: 'descripcion' },
		{ label: $t('noticiasTableHeadersEmoji'), key: 'emoji' }
	];

	function renderColumns(key: string, obj: any) {
		if (key === 'descripcion') return (obj[key] || '').toString().slice(0, 80) || '--';
		return obj[key] || '--';
	}

	function openCreate() {
		goto('/admin/noticias/new');
	}

	// Edit modal state
	let showEditModal = false;
	let editForm: HTMLFormElement | null = null;
	let selectedNoticia: any = null;
	let editTitulo = '';
	let editDescripcion = '';
	let editEmoji = '';
	let updating = false;

	// Delete confirmation state
	let showConfirmDelete = false;
	let deleteForm: HTMLFormElement | null = null;
	let deleteNoticia: any = null;

	function handleEdit(e: any) {
		selectedNoticia = e?.detail?.data;
		if (!selectedNoticia) return;
		editTitulo = selectedNoticia?.titulo || '';
		editDescripcion = selectedNoticia?.descripcion || '';
		editEmoji = selectedNoticia?.emoji || '';
		showEditModal = true;
	}

	// Extract first emoji from input
	function extractEmoji(text: string): string {
		if (!text) return '';
		// Match emoji using unicode ranges
		const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F910}-\u{1F96B}\u{1F980}-\u{1F9E0}]/u;
		const match = text.match(emojiRegex);
		return match ? match[0] : '';
	}

	function handleEmojiInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value;
		const emoji = extractEmoji(value);
		editEmoji = emoji;
		input.value = emoji;
	}

	const handleUpdate = () => {
		updating = true;
		return async ({ result, update }: any) => {
			updating = false;
			await update();
			if (result.type === 'success') {
				toast.success($t('updateNoticiaSuccess'));
				showEditModal = false;
				// refresh list
				goto('/admin/noticias');
			} else {
				const err = result.data?.error || $t('updateNoticiaError');
				toast.error(err);
			}
		};
	};

	function showDeleteConfirmation(e: any) {
		deleteNoticia = e?.detail?.data;
		if (!deleteNoticia) return;
		showConfirmDelete = true;
	}

	const handleDelete = () => {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				toast.success($t('deleteNoticiaSuccess') || 'Noticia eliminada');
				// ensure UI state is cleaned
				showConfirmDelete = false;
				deleteNoticia = null;
				// refresh list (navigate to same route)
				goto('/admin/noticias');
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<MainCard pages={[{ href: '/admin/noticias', value: $t('noticiasTitle') }]}>
	<div class="flex justify-between mb-6 sm:flex-row flex-col gap-6">
		<button type="button" class="btn-bo uppercase" on:click={openCreate}>
			<Add />
			<span>{$t('newNoticiaBtn')}</span>
		</button>
	</div>

	<Table
		{columns}
		data={data.noticias}
		render={renderColumns}
		orderCols={['id', 'titulo']}
		on:edit={handleEdit}
		on:delete={showDeleteConfirmation}
	></Table>
</MainCard>


<!-- Edit Modal -->
{#if showEditModal}
	<Modal bind:show={showEditModal} title={$t('editNoticiaModalTitle')} on:cancel={() => (showEditModal = false)} btnOk={false} btnCancel={false}>
		<div class="flex flex-col gap-4">
			<!-- Image preview block styled like the design -->
			<div class="w-full">
				<div class="mx-auto rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center" style="height:160px; width:100%; max-width:720px;">
					{#if selectedNoticia?.imagen}
						<img src={selectedNoticia.imagen} alt="Imagen" class="object-contain max-h-full w-full" />
					{:else}
						<div class="text-center text-gray-500 dark:text-gray-300">
							{$t('noticiaImagenPlaceholder')}
						</div>
					{/if}
				</div>
			</div>

			<form method="POST" action="?/update" enctype="multipart/form-data" bind:this={editForm} use:enhance={handleUpdate} class="w-full max-w-3xl mx-auto">
				<input type="hidden" name="id" value={selectedNoticia?.id} />

				<div class="mb-4">
					<label for="edit-titulo" class="block mb-2 text-sm font-medium text-white">{$t('noticiaTituloLabel')}</label>
					<input id="edit-titulo" name="titulo" type="text" class="w-full bg-gray-500/50 text-white rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary-500" bind:value={editTitulo} required />
				</div>

				<div class="mb-4">
					<label for="edit-descripcion" class="block mb-2 text-sm font-medium text-white">{$t('noticiaDescripcionLabel')}</label>
					<textarea id="edit-descripcion" name="descripcion" class="w-full bg-gray-500/50 text-white rounded-lg px-4 py-2.5 h-28 border-none focus:ring-2 focus:ring-primary-500" bind:value={editDescripcion}></textarea>
				</div>

				<div class="mb-2">
					<label for="edit-emoji" class="block mb-2 text-sm font-medium text-white">{$t('noticiaEmojiLabel')}</label>
					<input 
						id="edit-emoji" 
						name="emoji" 
						type="text" 
						bind:value={editEmoji}
						on:input={handleEmojiInput}
						on:paste={handleEmojiInput}
						class="w-full bg-gray-500/50 text-white rounded-lg px-4 py-2.5 border-none focus:ring-2 focus:ring-primary-500 text-center text-2xl" 

					/>
				</div>
			</form>

		</div>

		<svelte:fragment slot="footer">
			<div class="flex justify-center gap-4 w-full">
				<button type="button" class="btn-light px-8 py-2 rounded-full min-w-[140px]" on:click={() => (showEditModal = false)}>{$t('cancelBtn')}</button>
				<button type="button" class="btn-bo px-8 py-2 rounded-full min-w-[140px]" on:click={() => editForm?.requestSubmit()} disabled={updating}>{$t('updateNoticiaBtn')}</button>
			</div>
		</svelte:fragment>
	</Modal>
{/if}

<!-- Delete Form (hidden) -->
<form
	method="POST"
	action="?/delete"
	class="hidden"
	bind:this={deleteForm}
	use:enhance={handleDelete}
>
	<input name="deletedId" value={deleteNoticia?.id} type="hidden" />
</form>

<!-- Delete Confirmation Modal -->
<Modal
	bind:show={showConfirmDelete}
	title={$t('deleteNoticiaModalTitle') || 'Eliminar noticia'}
	on:cancel={() => { deleteNoticia = null; showConfirmDelete = false; }}
	btnOk={false}
	btnCancel={false}
>
	<p class="text-base leading-relaxed text-gray-400">
		{$t('deleteNoticiaModalSubtitle') || '¿Estás seguro que deseas eliminar'}
		<strong>{deleteNoticia?.titulo}</strong>?
	</p>

	<svelte:fragment slot="footer">
		<div class="flex justify-center gap-6 w-full">
			<button type="button" class="btn-light px-8 py-2 rounded-full min-w-[140px]" on:click={() => { deleteNoticia = null; showConfirmDelete = false; }}>{$t('cancelBtn')}</button>
			<button type="button" class="btn-bo px-8 py-2 rounded-full min-w-[140px]" on:click={() => { showConfirmDelete = false; deleteForm?.requestSubmit(); }}>{$t('deleteNoticiaModalTitle') || 'Eliminar'}</button>
		</div>
	</svelte:fragment>

</Modal>


 