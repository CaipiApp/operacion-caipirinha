<script lang="ts">
	import { DocType, type Document } from '$lib/models';
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import { delay, isMobileDevice } from '$lib/utils';
	import { goto, invalidateAll } from '$app/navigation';
	import Camera4 from '../Camera4.svelte';
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/Icons/Spinner.svelte';
	import BackBtn from './BackBtn.svelte';
	import { page } from '$app/stores';

	export let title: string;
	export let subtitle: string;
	export let docType: DocType;
	export let fileName: string;
	export let cuil: string;
	export let defaultImgPath: string;
	export let lastDni: Document | undefined | null;

	let imgsrc: string;
	let fileInput: HTMLInputElement;
	let fileInputUploadPhoto: HTMLInputElement;
	let sending = false;
	let showCamera = false;
	let disabledCamera = true;

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update({});

			if (result.type === 'success') {
				await delay(3000);
				sending = false;
				invalidateAll(); // rerun load func (equivale recargar pagina)
			} else {
				sending = false;
				console.error(result);
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

	// Cargar la imagen del file manager al fileInput
	function showPreview(): any {
		if (!fileInputUploadPhoto) return;
		const img = fileInputUploadPhoto.files?.[0];

		if (fileInputUploadPhoto.files) {
			if (img) {
				imgsrc = URL.createObjectURL(img);

				// Transferir la imagen al input file oculto
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(fileInputUploadPhoto.files[0]);
				fileInput.files = dataTransfer.files;
			}
		}
	}

	function handleClick() {
		if (disabledCamera) {
			fileInputUploadPhoto.click();
		} else {
			showCamera = true;
		}
	}

	async function handlePhotoBlob(event: CustomEvent<{ blob: Blob }>) {
		const blob = event.detail.blob;
		const file = new File([blob], `${fileName}`, { type: 'image/png', lastModified: Date.now() });
		imgsrc = URL.createObjectURL(file);
		showCamera = false;

		// Transferir la imagen al input file oculto
		const dt = new DataTransfer();
		dt.items.add(file);

		// Wait for the DOM to update so that fileInput is defined
		await delay(0);
		fileInput.files = dt.files;
	}

	onMount(async () => {
		if (isMobileDevice()) disabledCamera = false;
	});
</script>

{#if showCamera}
	<Camera4 on:photoBlob={handlePhotoBlob} />
{:else}
	<section
		class="px-10 sm:pb-12 pb-4 w-full min-h-[calc(100dvh)] max-w-xl mx-auto flex flex-col gap-6 justify-between items-center shadow-md"
	>
		<BackBtn on:goBack />

		<form
			method="post"
			action="?/upload"
			class="flex flex-col flex-grow items-center justify-between text-center gap-4 max-w-xs"
			use:enhance={handleSubmit}
			enctype="multipart/form-data"
		>
			{#if lastDni}
				<div class="border border-solid border-red-500 p-4 rounded-xl max-w-sm mx-4">
					<p class="text-red-500 text-center">
						{lastDni.comment || 'El DNI fue rechazado. Por favor ingresá una foto nueva del DNI.'}
					</p>
				</div>
			{/if}
			<p>
				{subtitle}
				<br />
				Necesitamos validar tu identidad
			</p>
			<h3 class="text-primary font-popMedium">{title}</h3>

			<!-- Preview -->

			<div class="relative justify-center p-4 w-full">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<img
					id="preview"
					src={imgsrc || defaultImgPath}
					alt="dni"
					class="w-full h-full object-cover"
					on:click={handleClick}
				/>
				<div
					class="absolute top-0 left-0 w-7 h-7 border-4 border-primary rounded-tl-xl border-b-0 border-r-0"
				></div>
				<div
					class="absolute top-0 right-0 w-7 h-7 border-4 border-primary rounded-tr-xl border-l-0 border-b-0"
				></div>
				<div
					class="absolute bottom-0 left-0 w-7 h-7 border-4 border-primary rounded-bl-xl border-r-0 border-t-0"
				></div>
				<div
					class="absolute bottom-0 right-0 w-7 h-7 border-4 border-primary rounded-br-xl border-l-0 border-t-0"
				></div>
			</div>
			<ul class="text-left list-disc font-popLight w-full">
				<li>Debe ser el último ejemplar vigente.</li>
				<li>Asegurate de que la información sea legible.</li>
				<li>Subí una foto con buena iluminación.</li>
			</ul>
			<!-- Botones -->
			<div class="flex flex-col gap-4 w-full">
				<button
					type="submit"
					disabled={sending || !fileInput?.files?.[0]}
					class="btn text-white inline-flex items-center justify-center gap-4"
				>
					<span>CONTINUAR</span>

					{#if sending}
						<Spinner width={'20'} height={'20'} />
					{/if}
				</button>
				<button
					type="button"
					class="bg-white text-secondary font-popMedium py-2 px-10 rounded-3xl hover:opacity-90 hover:cursor-pointer inline-flex items-center justify-center gap-4 border-2 border-secondary disabled:bg-mediumGray disabled:cursor-not-allowed disabled:border-none disabled:text-white"
					disabled={disabledCamera}
					on:click={() => (showCamera = true)}
				>
					<span>+ TOMAR FOTO</span>
				</button>

				<button
					type="button"
					class="bg-white text-secondary font-popMedium py-2 px-10 rounded-3xl hover:opacity-90 hover:cursor-pointer inline-flex justify-center items-center gap-4 border-2 border-secondary"
					on:click={() => fileInputUploadPhoto.click()}
				>
					<span>+ SUBIR FOTO</span>
				</button>
			</div>

			<input type="hidden" name="docType" value={docType} />
			<input type="hidden" name="cuil" value={cuil} />
			<input type="hidden" name="fileName" value={fileName} />
			<input
				type="file"
				name="file"
				id="fileInput"
				accept="image/*"
				class="hidden"
				bind:this={fileInput}
			/>
			<input
				type="file"
				id="fileInputUploadPhoto"
				accept="image/*"
				class="hidden"
				bind:this={fileInputUploadPhoto}
				on:change={showPreview}
			/>
		</form>
	</section>
{/if}

<style>
	li::marker {
		color: #6b9907;
	}
</style>
