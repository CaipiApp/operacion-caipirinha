<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import type { Empresa } from '$lib/models';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { t } from '$lib/translate/i18n';
	import { Fileupload, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let empresa: Empresa | undefined = undefined;

	let sending = false;

	let imgsrc: string;

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;

			if (result.type === 'success') {
				toast.success($t('newEnterpriseSuccess'));
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

	onMount(() => {
		if(empresa?.imagen) {
			imgsrc = empresa.imagen;
		}
	})
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
		<Label class="mb-2 font-popMedium">{$t('profileEnterpriseLabel')} <span class="text-red-600">*</span></Label>
		<Input
			type="text"
			id="nombre"
			name="nombre"
			required={true}
			value={empresa?.nombre}
			error={$page.form?.errors?.nombre}
		/>
	</div>
	<div class="sm:col-span-1 col-span-2">
		<Label class="mb-2 font-popMedium">{$t('newEnterpriseTelephoneLabel')}</Label>
		<Input
			type="text"
			id="telefono"
			name="telefono"
			value={empresa?.telefono}
			error={$page.form?.errors?.telefono}
		/>
	</div>

	<div class="col-span-full">
		<Label class="mb-2 font-popMedium">{$t('newEnterpriseAddressLabel')}</Label>
		<Input
			type="text"
			id="direccion"
			name="direccion"
			value={empresa?.direccion}
			error={$page.form?.errors?.direccion}
		/>
	</div>

	<div class="col-span-full">
		<Label forId="imagen" label={$t('newEnterpriseImageLabel')} />

		<Fileupload on:change={handleFileChange} name="imagen" />
	</div>
	{#if empresa?.imagen || imgsrc}
		<div class="col-span-full flex justify-center">
			<img
				src={imgsrc || empresa?.imagen}
				alt="Imagem da empresa"
				class="sm:max-w-96 max-w-64 mt-4"
			/>
		</div>
	{/if}

	<div class="mt-5">
		<PrimaryButton type="submit" value={$t('newEnterpriseSendBtn')} disabled={sending} />
	</div>
</form>
