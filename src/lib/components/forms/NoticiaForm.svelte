<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/translate/i18n';
	import { Fileupload, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let noticia: any | undefined = undefined;

	let sending = false;
	let imgsrc: string;
	let emojiValue = noticia?.emoji || '';

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;

			if (result.type === 'success') {
				toast.success($t('createNoticiaSuccess'));
				// after creating a noticia, redirect to the noticias list
				setTimeout(() => goto('/admin/noticias'), 100);
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

	const handleFileChange = (e: any) => {
		const target = e?.target as HTMLInputElement;
		const file = target?.files?.[0];
		if (!file) return;
		imgsrc = URL.createObjectURL(file);
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
		emojiValue = emoji;
		input.value = emoji;
	}

	onMount(() => {
		if (noticia?.imagen) {
			imgsrc = noticia.imagen;
		}
		if (noticia?.emoji) {
			emojiValue = noticia.emoji;
		}
	});
</script>

<form
	use:enhance={handleSubmit}
	method="POST"
	action={formAction}
	class="max-w-2xl mx-auto grid grid-cols-2 gap-5"
	enctype="multipart/form-data"
	on:submit={() => (imgsrc = '')}
>
	<div class="sm:col-span-1 col-span-2">
		<label for="titulo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{$t('noticiaTituloLabel')} <span class="text-red-600">*</span></label>
		<input type="text" id="titulo" name="titulo" required class="w-full bg-gray-100 dark:bg-gray-500/50 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 border border-gray-300 dark:border-none focus:ring-2 focus:ring-primary-500" value={noticia?.titulo || ''} />
	</div>

	<div class="col-span-full">
		<label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{$t('noticiaDescripcionLabel')}</label>
		<textarea id="descripcion" name="descripcion" class="w-full bg-gray-100 dark:bg-gray-500/50 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 h-28 border border-gray-300 dark:border-none focus:ring-2 focus:ring-primary-500">{noticia?.descripcion || ''}</textarea>
	</div>

	<div class="sm:col-span-1 col-span-2">
		<label for="emoji" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{$t('noticiaEmojiLabel')}</label>
		<input 
			type="text" 
			id="emoji" 
			name="emoji" 
			bind:value={emojiValue}
			on:input={handleEmojiInput}
			on:paste={handleEmojiInput}
			class="w-full bg-gray-100 dark:bg-gray-500/50 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 border border-gray-300 dark:border-none focus:ring-2 focus:ring-primary-500 text-center text-2xl" 

		/>
	</div>

	<div class="col-span-full">
		<label for="imagen" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{$t('noticiaImagenLabel')}</label>
		<Fileupload id="imagen" on:change={handleFileChange} name="imagen" />
	</div>

	{#if noticia?.imagen || imgsrc}
		<div class="col-span-full flex justify-center">
			<div class="rounded-xl overflow-hidden border-4 border-gray-500/50 mt-4" style="max-width: 400px;">
				<img src={imgsrc || noticia?.imagen} alt="Imagen noticia" class="w-full h-auto object-cover" />
			</div>
		</div>
	{/if}

	<div class="mt-5">
		<PrimaryButton type="submit" value={$t('createNoticiaBtn')} disabled={sending} />
	</div>
</form>

