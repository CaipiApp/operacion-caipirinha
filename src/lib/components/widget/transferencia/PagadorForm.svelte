<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import toast from 'svelte-french-toast';
	import Wrapper from '../Wrapper.svelte';
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	import Label from '$lib/components/Label.svelte';
	import BackBtn from '$lib/components/widget/transferencia/BackBtn.svelte';
	import type { Pais } from '$lib/models/pais.model';
	import Spinner from '$lib/components/Icons/Spinner.svelte';
	import Input from '$lib/components/Input.svelte';
	import { Checkbox } from 'flowbite-svelte';

	export let persona: { nombre: string, cuil: string, tipo: string} | undefined;
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
		localStorage.removeItem('email');
		localStorage.removeItem('phoneNumber');
		localStorage.removeItem('pais');
		localStorage.removeItem('terminos');
		localStorage.removeItem('isNotFatca');
		localStorage.removeItem('isNotPep_uif');
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

<Wrapper myclass="items-center !bg-gradient-to-t !from-brand-dark !to-brand-gray">
	<BackBtn on:goBack />

	<img src="/images/caipi-icon.svg" alt="caipi-icon" class="w-24 mx-auto pt-6" />
	<div class="w-full flex flex-col justify-between max-w-sm h-full flex-grow">
		<h2 class="w-full font-popLight mt-4 text-2xl">Hola,</h2>
		<p class="w-full font-popMedium text-2xl mb-2">{persona?.nombre}</p>
		<p class="w-full mb-4 font-popLight">
			CUIL/CUIT: <span class="font-popMedium">{formatearCUIL(persona?.cuil)}</span>
		</p>
		<p class="font-popMedium mb-4">
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
					<Label forId="email" label="Ingresá tu e-mail:" />
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="tucorreo@ejemplo.com"
						required
						error={$page.form?.errors?.email}
						value={email}
					/>
				</div>
				<div class="w-full max-w-lg">
					<Label forId="phoneNumber" label="Ingresá tu teléfono:" />
					<Input
						type="text"
						id="phoneNumber"
						name="phoneNumber"
						placeholder="+54 9 0000 00-0000"
						required
						value={phoneNumber}
						error={$page.form?.errors?.phoneNumber}
					/>
				</div>
				<div class="w-full max-w-lg">
					<Label forId="country" label="Ingresá tu nacionalidad:" />
					<Select
						class="text-gray-900 focus:outline-none focus:ring focus:ring-brand-primary"
						items={paisesOpts}
						value="Argentina"
						id="country"
						name="country"
						required={true}
						placeholder="Nombre de pais..."
						--background="#f9fafb"
						--padding="0px 10px"
						--border="none"
						--border-focused="1px solid #a9d800"
						--border-hover="none"
						--border-radius="8px"
						--list-background="#f9fafb"
						--item-is-active-bg="#a9d800"
						--item-hover-bg="#e5e7eb"
					/>
				</div>

				<div class="w-full max-w-lg mt-4">
					<label for="isFatca" class="flex items-center justify-between mb-2">
						No soy ciudadano E.E.U.U./U.E.
						<Checkbox
							color="orange"
							id="isFatca"
							name="isFatca"
							bind:checked={isNotFatca}
							class="scale-110"
						/>
					</label>
					<label for="PEP_UIF" class="flex items-center justify-between mb-2">
						No soy ciudadano PEP/UIF
						<Checkbox
							color="orange"
							id="PEP_UIF"
							name="PEP_UIF"
							bind:checked={isNotPep_uif}
							class="scale-110"
						/>
					</label>
					<label for="terminos" class="flex items-center justify-between mb-2">
						<button
							type="button"
							on:click={saveInputsAndRedirect}
							class="bg-none border-none text-inherit hover:text-red-500 underline font-inherit cursor-pointer p-0 m-0"
							>Acepto términos y condiciones</button
						>
						<Checkbox
							color="orange"
							id="terminos"
							name="terminos"
							bind:checked={terminos}
							class="scale-110"
						/>
					</label>
				</div>
			</div>

			<button
				type="submit"
				disabled={sending || !terminos || !isNotFatca || !isNotPep_uif}
				class="btn-light !text-brand-primary inline-flex items-center justify-center gap-4 mt-4"
			>
				<span>CONTINUAR</span>

				{#if sending}
					<Spinner width={'20'} height={'20'} />
				{/if}
			</button>
		</form>
	</div>
</Wrapper>
