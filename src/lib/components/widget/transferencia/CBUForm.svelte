<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Wrapper from '../Wrapper.svelte';
	import Input from '$lib/components/Input.svelte';
	import toast from 'svelte-french-toast';
	import Label from '$lib/components/Label.svelte';
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

<Wrapper myclass="!bg-gradient-to-t !from-brand-dark !to-brand-gray">
	<BackBtn on:goBack />

	<img src="/images/caipi-icon.svg" alt="caipi-icon" class="w-36 mx-auto py-12" />

	<form
		use:enhance={handleSubmit}
		method="post"
		action="?/cbu"
		class="flex-grow flex flex-col justify-between items-center"
	>
		<input type="hidden" name="cuil" value={$page.data.pagador?.cuil} />
		<input type="hidden" name="medioPago" value={$page.url.searchParams.get('medio')} />

		<div class="w-full max-w-sm">
			<Label forId="cbu" label="Ingresá tu CBU/CVU/ALIAS" />
			<Input
				type={'text'}
				id={'cbu'}
				name={'cbu'}
				placeholder={'1234567890/alias'}
				value={cuenta?.cbu || ''}
				error={$page.form?.errors?.cbu}
				required={true}
			/>
			<p class="w-full mx-auto max-w-sm mt-4 font-popLight">
				Esta cuenta será usada en el caso de que existan devoluciones.
			</p>
		</div>

		<button
			type="submit"
			disabled={sending}
			class="btn-light !text-brand-primary inline-flex items-center justify-center gap-4"
		>
			<span>CONTINUAR</span>

			{#if sending}
				<Spinner width={'20'} height={'20'} />
			{/if}
		</button>
	</form>
</Wrapper>
