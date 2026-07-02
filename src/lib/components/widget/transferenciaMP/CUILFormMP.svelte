<script lang="ts">
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import Label from '$lib/components/Label.svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import WrapperMp from './WrapperMP.svelte';
	import { afterUpdate } from 'svelte';
	import Spinner from '$lib/components/Icons/Spinner.svelte';
	import BackBtn from './BackBtn.svelte';

	let cuil = '';
	let sending = false;
	export let error: any = undefined;

	function handleSubmit(e: any) {
		e.preventDefault();
		sending = true;
		if (!cuil) {
			toast.error('ingrese un cuil');
			return;
		}
		const searchParams = $page.url.searchParams;
		searchParams.set('cuil', cuil?.trim()?.replaceAll('-', ''));
		goto(`${$page.url.pathname}?${searchParams}`, { replaceState: true, invalidateAll: true });
	}
	beforeNavigate(() => {
		if (error) error = undefined;
	});
	afterUpdate(() => {
		if (error) sending = false;
	});
</script>

<WrapperMp>
	<BackBtn on:goBack />
		
	<form on:submit={handleSubmit} class="p-8 flex-grow flex flex-col justify-between">
		<img src="/images/mercadopago2.png" alt="caipi-icon" class="w-36 mx-auto pb-12 pt-4" />
		<div class="w-full flex flex-col flex-grow">
			<Label forId="cuil" label="Ingresá tu CUIL/CUIT:" class="label-light-mp" />
			<input
				type="text"
				id="cuil"
				name="cuil"
				bind:value={cuil}
				class="input-light-mp"
				placeholder="00-12345678-0"
				class:input-light-error={error}
				required
			/>
			{#if error}
				<p class="mt-2 text-sm text-red-700 font-bold w-full max-w-sm">
					{error.message}
				</p>
			{/if}
		</div>
		<button
			type="submit"
			disabled={sending}
			class="btn-mp inline-flex items-center justify-center gap-4"
		>
			<span>CONTINUAR</span>

			{#if sending}
				<Spinner width={'20'} height={'20'} />
			{/if}
		</button>
	</form>
</WrapperMp>
