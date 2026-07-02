<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Comision, Flujos } from '$lib/models';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { t } from '$lib/translate/i18n';
	import Input from '$lib/components/Input.svelte';
	import { Button, Label } from 'flowbite-svelte';
	import CurrencyInput from '../CurrencyInput.svelte';

	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let id: number;
	export let flujo: Flujos;
	export let monto: number;
	export let showModal: boolean;

	let sending = false;

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;
			
			if (result.type === 'success') {
				if (result.data?.message) toast.success(result.data?.message);
				showModal = false
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
	class="mx-auto grid grid-cols-2 gap-5"
>
	<input type="hidden" name="id" value={id} />

	<div class="sm:col-span-1 col-span-2">
		<Label forId="flujo" class="mb-2 font-popMedium">Flujo</Label>
		<Input
			type="text"
			id="flujo"
			name="flujo"
			disabled
			required
			value={flujo}
			error={$page.form?.errors?.flujo}
		/>
	</div>
	<div class="sm:col-span-1 col-span-2">
		<Label forId="monto" class="mb-2 font-popMedium">Monto <span class="text-red-600">*</span></Label>
	
		<CurrencyInput 
			required={true}
			name="monto"
			value={monto} 
			error={$page.form?.errors?.monto}
			fractionDigits={6}
		/>
	</div>
	
	<div class="mt-5">
		<Button type="submit" class="w-full" disabled={sending}>{$t('newAccountSendBtn')}</Button>
	</div>
</form>
