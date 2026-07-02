<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Cuenta } from '$lib/models';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { t } from '$lib/translate/i18n';
	import Input from '$lib/components/Input.svelte';
	import { Button, Label } from 'flowbite-svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let cuenta: Cuenta | undefined = undefined;

	let sending = false;

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;

			if (result.type === 'success') {
				if (result.data?.message) toast.success($t(result.data?.message));
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<form
	use:enhance={handleSubmit}
	method="POST"
	action={formAction}
	class="max-w-4xl mx-auto grid grid-cols-2 gap-5"
>
	<div class="sm:col-span-1 col-span-2">
		<Label forId="tipo" class="mb-2 font-popMedium">{$t('newAccountTypeLabel')} <span class="text-red-600">*</span></Label>
		<Input
			type="text"
			id="tipo"
			name="tipo"
			required
			value={cuenta?.tipo}
			error={$page.form?.errors?.tipo}
		/>
	</div>
	<div class="sm:col-span-1 col-span-2">
		<Label forId="documentNumber" class="mb-2 font-popMedium">CPF/CNPJ <span class="text-red-600">*</span></Label>
		<Input
			type="text"
			id="documentNumber"
			name="documentNumber"
			required
			value={cuenta?.documentNumber}
			error={$page.form?.errors?.documentNumber}
			disabled={cuenta ? true : false}
		/>
	</div>
	<div class="col-span-2">
		<Label forId="clave" class="mb-2 font-popMedium">{$t('newAccountKeyLabel')} <span class="text-red-600">*</span></Label>
		<Input
			type="text"
			id="clave"
			name="clave"
			required
			value={cuenta?.clave}
			error={$page.form?.errors?.clave}
			disabled={cuenta ? true : false}
		/>
	</div>

	<div class="mt-5">
		<Button type="submit" class="w-full" disabled={sending}>{$t('newAccountSendBtn')}</Button>
	</div>
</form>
