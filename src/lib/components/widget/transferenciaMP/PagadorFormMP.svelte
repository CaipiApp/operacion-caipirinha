<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	import Label from '$lib/components/Label.svelte';
	import WrapperMp from './WrapperMP.svelte';
	import CardMp from '../CardMP.svelte';
	import type { Pais } from '$lib/models/pais.model';
	import BackBtn from '$lib/components/widget/transferenciaMP/BackBtn.svelte';
	import Spinner from '$lib/components/Icons/Spinner.svelte';

	export let persona: { nombre: string, cuil: string, tipo: string } | undefined;
	export let paises: Pais[] = [];

	let sending = false;
	let terminos = false;
	let isNotFatca = false;
	let isNotPep_uif = false;
	let email = '';
	let pais = 'Argentina';
	let phoneNumber = '';

	onMount(() => {
		email = localStorage.getItem('email') || '';
		phoneNumber = localStorage.getItem('phoneNumber') || '';
		pais = localStorage.getItem('pais') || 'Argentina';
		terminos = localStorage.getItem('terminos') === 'true';
		isNotFatca = localStorage.getItem('isNotFatca') === 'true';
		isNotPep_uif = localStorage.getItem('isNotPep_uif') === 'true';
		localStorage.clear();
	});

	function saveInputsAndRedirect() {
		localStorage.setItem('email', email);
		localStorage.setItem('phoneNumber', phoneNumber);
		localStorage.setItem('pais', pais);
		localStorage.setItem('terminos', JSON.stringify(terminos));
		localStorage.setItem('isNotFatca', JSON.stringify(isNotFatca));
		localStorage.setItem('isNotPep_uif', JSON.stringify(isNotPep_uif));
		goto('/pagos/terminosYCondiciones');
	}

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			await update({ reset: false });
			sending = false;

			if (result.type === 'success') {
				invalidateAll();
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};

	const formatearCUIL = (cuil: string | undefined) => {
		if (!cuil) return '';
		return cuil.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3');
	};

	let paisesOpts = paises?.map((pais) => ({ label: pais.nombre, value: pais.nombre }));
</script>

<WrapperMp>
	<BackBtn on:goBack />
		
	<div class="p-8 sm:gap-6 gap-3 w-full flex flex-col justify-between h-full flex-grow">
		<CardMp>
			<h2 class="w-full font-popLight text-2xl">Hola,</h2>
			<p class="w-full font-popMedium text-2xl mb-2">{persona?.nombre}</p>
			<p class="w-full font-popLight">
				CUIL/CUIT: <span class="font-popMedium">{formatearCUIL(persona?.cuil)}</span>
			</p>
		</CardMp>
		<p class="font-popMedium mt-4">
			Tranqui, solo queremos comprobar que sos vos. Estos datos te los pediremos por única vez.
		</p>
		<form
			use:enhance={handleSubmit}
			method="post"
			action="?/addPagador"
			class="w-full flex-grow flex flex-col h-full"
		>
			<input type="hidden" name="name" value={persona?.nombre} required />
			<input type="hidden" name="legalId" value={persona?.cuil} required />
			<input type="hidden" name="tipo" value={persona?.tipo} required />

			<div class="w-full flex flex-col gap-3 flex-grow">
				<div class="w-full max-w-lg">
					<Label forId="email" label="Ingresá tu e-mail:" class="label-light-mp" />
					<input
						type="email"
						id="email"
						name="email"
						placeholder="tucorreo@ejemplo.com"
						required
						class="input-light-mp"
						class:input-light-error={$page.form?.errors?.email}
						bind:value={email}
					/>
					{#if $page.form?.errors?.email}
						<p class="mt-2 text-sm text-red-700 font-bold">
							{$page.form?.errors?.email}
						</p>
					{/if}
				</div>
				<div class="w-full max-w-lg">
					<Label forId="phoneNumber" label="Ingresá tu teléfono:" class="label-light-mp" />
					<input
						type="string"
						id="phoneNumber"
						name="phoneNumber"
						placeholder="+54 9 0000 00-0000"
						required
						class="input-light-mp"
						class:input-light-error={$page.form?.errors?.phoneNumber}
						bind:value={phoneNumber}
					/>
					{#if $page.form?.errors?.phoneNumber}
						<p class="mt-2 text-sm text-red-700 font-bold">
							{$page.form?.errors?.phoneNumber}
						</p>
					{/if}
				</div>
				<div class="w-full max-w-lg">
					<Label forId="country" label="Ingresá tu nacionalidad:" class="label-light-mp" />
					<Select
						class="text-gray-900 focus:outline-none focus:ring focus:ring-secondary"
						items={paisesOpts}
						value="Argentina"
						id="country"
						name="country"
						required={true}
						placeholder="Nombre de pais..."
						--padding="0px 10px"
						--border="1px solid #c6c6c6"
						--border-focused="1px solid #019DE1"
						--border-radius="5px"
						--list-background="#f9fafb"
						--item-is-active-bg="#019DE1"
						--item-hover-bg="#e5e7eb"
					/>
				</div>

				<div class="w-full max-w-lg mt-4 font-popMedium">
					<label for="isFatca" class="flex items-center justify-between mb-2">
						No soy ciudadano E.E.U.U./U.E.
						<input
							type="checkbox"
							id="isFatca"
							name="isFatca"
							class="accent-mp scale-125"
							bind:checked={isNotFatca}
						/>
					</label>
					<label for="PEP_UIF" class="flex items-center justify-between mb-2">
						No soy ciudadano PEP/UIF
						<input
							type="checkbox"
							id="PEP_UIF"
							name="PEP_UIF"
							class="accent-mp scale-125"
							bind:checked={isNotPep_uif}
						/>
					</label>
					<label for="terminos" class="flex items-center justify-between mb-2">
						<button type="button" on:click={saveInputsAndRedirect} class="hover:text-mp underline"
							>Acepto términos y condiciones</button
						>
						<input
							type="checkbox"
							id="terminos"
							name="terminos"
							class="accent-mp scale-125"
							bind:checked={terminos}
							required
						/>
					</label>
				</div>
			</div>
			<button
				type="submit"
				disabled={sending || !terminos || !isNotFatca || !isNotPep_uif}
				class="btn-mp inline-flex items-center justify-center gap-4 mt-4"
			>
				<span>CONTINUAR</span>

				{#if sending}
					<Spinner width={'20'} height={'20'} />
				{/if}
			</button>
		</form>
	</div>
</WrapperMp>
