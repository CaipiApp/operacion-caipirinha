<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import Label from '$lib/components/Label.svelte';
	import WrapperMp from './WrapperMP.svelte';
	import Spinner from '$lib/components/Icons/Spinner.svelte';
	import BackBtn from './BackBtn.svelte';

	$: cuenta = $page.data.pagador?.cuentas?.[0];

	let sending = false;

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update({ reset: false });
			sending = false;

			if (result.type === 'success') {
				invalidateAll(); // rerun load function
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<WrapperMp>
	<BackBtn on:goBack />

	<form
		use:enhance={handleSubmit}
		method="post"
		action="?/cbu"
		class="p-8 flex flex-col flex-grow justify-between"
	>
		<input type="hidden" name="cuil" value={$page.data.pagador?.cuil} />
		<input type="hidden" name="medioPago" value={$page.url.searchParams.get('medio')} />

		<div>
			<h2 class="font-popMedium mb-4">Ingresá una cuenta a tu nombre</h2>
			<Label forId="cbu" label="Ingresá tu CBU/CVU/ALIAS" class="label-light-mp" />

			<input
				type="text"
				id="cbu"
				name="cbu"
				placeholder="123456789012345678"
				required
				class="input-light-mp"
				class:input-light-error={$page.form?.errors?.cbu}
				value={cuenta?.cbu || ''}
			/>
			{#if $page.form?.errors?.cbu}
				<p class="mt-2 text-sm text-red-700 font-bold">
					{$page.form?.errors?.cbu}
				</p>
			{/if}
		</div>

		<button
			type="submit"
			disabled={sending}
			class="btn-mp inline-flex items-center justify-center gap-4 mt-4"
		>
			<span>CONTINUAR</span>

			{#if sending}
				<Spinner width={'20'} height={'20'} />
			{/if}
		</button>
	</form>
</WrapperMp>
