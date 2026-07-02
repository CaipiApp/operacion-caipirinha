<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Add from '$lib/components/Icons/Add.svelte';
	import MainCard from '$lib/components/MainCard.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { Button } from 'flowbite-svelte';
	import type { Notificacion } from '$lib/models/notificacion.model.js';
	import toast from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';

	export let data;

	let showCreateModal = false;
	let sending = false;

	const columns = [
		{ label: 'ID', key: 'id' },
		{ label: 'Título', key: 'titulo' },
		{ label: 'Descripción', key: 'descripcion' },
		{ label: 'Fecha de Creación', key: 'createdAt' }
	];

	const orderCols = ['id', 'createdAt'];

	function renderColumns(key: string, obj: Notificacion) {
		if (key === 'createdAt') {
			return dayjs(obj[key]).format('DD/MM/YYYY HH:mm');
		}

		if (key === 'descripcion') {
			return obj.descripcion?.length > 50
				? obj.descripcion.substring(0, 50) + '...'
				: obj.descripcion || '--';
		}

		return obj[key as keyof Notificacion] || '--';
	}

	function handleCreate() {
		showCreateModal = true;
	}

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update();
			sending = false;

			if (result.type === 'success') {
				showCreateModal = false;
				toast.success('Notificación creada exitosamente');
			} else {
				if (result.data?.message) toast.error(result.data.message);
			}
		};
	};
</script>

<MainCard pages={[{ href: '/admin/notificaciones', value: 'Notificaciones' }]}>
	<div class="flex justify-between mb-6 md:flex-row flex-col gap-6">
		<div class="flex gap-3 items-center w-full md:w-auto">
			<Button
				color="primary"
				type="button"
				class="flex justify-center items-center gap-2 uppercase"
				on:click={handleCreate}
			>
				<Add />
				<span>Crear Notificación</span>
			</Button>
		</div>
	</div>

	<div class="hidden md:block">
		<Table {columns} data={data.notificaciones} render={renderColumns} {orderCols} />
	</div>

	<Pagination {...data.meta} class="mt-3" />
</MainCard>

<Modal bind:show={showCreateModal} title="Crear Notificación">
	<form action="?/create" method="post" use:enhance={handleSubmit} class="space-y-4">
		<div>
			<label for="titulo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				Título <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="titulo"
				name="titulo"
				required
				placeholder="Ingrese el título"
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
			/>
		</div>
		<div>
			<label
				for="descripcion"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
			>
				Descripción
			</label>
			<textarea
				id="descripcion"
				name="descripcion"
				rows="4"
				placeholder="Ingrese la descripción"
				class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
			></textarea>
		</div>
		<div class="flex justify-end gap-3 pt-4">
			<Button color="alternative" on:click={() => (showCreateModal = false)}>Cancelar</Button>
			<Button color="primary" type="submit" disabled={sending}>
				{sending ? 'Creando...' : 'Crear'}
			</Button>
		</div>
	</form>
</Modal>
