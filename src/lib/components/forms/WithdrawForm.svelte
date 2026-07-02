<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import type { Pagador } from '$lib/models';
	import toast from 'svelte-french-toast';
	import Select from 'svelte-select';
	import { page } from '$app/stores';
	import { Label } from 'flowbite-svelte';
	import type { BankAccounts } from '$lib/models/manteca.js';
	import { createEventDispatcher } from 'svelte';
	import CurrencyInput from '../CurrencyInput.svelte';


	export let formAction: string | undefined = undefined;
	export let enhanceOpts: any = {};
	export let pagador: Pagador;
	export let cuentas: BankAccounts;
	export let monto: string;

	let sending = false;

	const dispatch = createEventDispatcher();
	
	$: cuentasOpts = cuentas?.ARS.map((cuenta, index) => ({ label: cuenta.cbu, value: index}));

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update(enhanceOpts);
			sending = false;

			if (result.type === 'success') {
				if (result.data?.message) toast.success(result.data?.message);
				dispatch("success")

			} else {
				console.error(result);
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<form
	use:enhance={handleSubmit}
	method="POST"
	action={formAction}
	class="max-w-2xl mx-auto grid grid-cols-2 gap-5"
>
	<input type="hidden" name="userId" value={pagador.userId} />
	<input type="hidden" name="coin" value="ARS" />
	
	<div>
		<Label class="mb-2">Cuenta <span class="text-red-600">*</span></Label>
		<Select
			items={cuentasOpts}
			name="cuenta"
			class="dark-select {$page.form?.errors?.cuenta ? 'select-invalid' : ''}"
			value={cuentasOpts[0]}
			clearable={false}
			required
		/>
		{#if $page.form?.errors?.cuenta}
			<p class="mt-2 text-sm text-red-500">
				{$page.form?.errors?.cuenta}
			</p>
		{/if}
	</div>

	<div>
		<Label class="mb-2">Monto <span class="text-red-600">*</span></Label>
		<CurrencyInput name="amount" required={true} value={parseFloat(monto)} error={$page.form?.errors?.amount} />
	</div>

	<div class="mt-5">
		<PrimaryButton type="submit" value="retirar" disabled={sending} />
	</div>
</form>
