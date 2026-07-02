<script lang="ts">
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import Wrapper from '../Wrapper.svelte';
	import Label from '$lib/components/Label.svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import Spinner from '$lib/components/Icons/Spinner.svelte';
	import { afterUpdate } from 'svelte';
	import Input from '$lib/components/Input.svelte';
	import BackBtn from './BackBtn.svelte';

	let cuil = '';
	export let error: any = undefined;

	let sending = false;
	function handleSubmit(e: any) {
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

<Wrapper myclass="!bg-gradient-to-t !from-brand-dark !to-brand-gray">
	<BackBtn on:goBack />
		
	<img src="/images/caipi-icon.svg" alt="caipi-icon" class="w-36 mx-auto py-12" />
	<form
		on:submit|preventDefault={handleSubmit}
		class="flex-grow flex flex-col justify-between items-center"
	>
		<div class="w-full flex flex-col max-w-sm">
			<Label forId="cuil" label="Ingresá tu CUIL/CUIT:" />
			<Input
				type="text"
				id="cuil"
				name="cuil"
				bind:value={cuil}
				placeholder="00-12345678-0"
				required
				error={error?.message}
			/>
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
