<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { currency2, getMontoOrigen } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import Comprobante from '../Comprobante.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	let comprobanteFile: File;

	$: ticket = $page.url.searchParams.get('ticket');

	$: montoOrigen = getMontoOrigen(data?.lock);

	onMount(async () => {
		const comprobante = await data.comprobante;
		const base64data = await fetch(`data:image/jpeg;base64,${comprobante}`);
		const blob = await base64data?.blob();
		if (blob) comprobanteFile = new File([blob], 'comprobante.png', { type: blob.type });
	});
</script>

{#if !ticket}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		<section
			class="relative w-full max-w-xl min-h-[calc(100dvh)] mx-auto flex flex-col gap-4 justify-between gradient-background p-8 shadow-md"
		>
			<div class="flex flex-col flex-grow h-full justify-center py-4 gap-4">
				<img src="/images/green-tick.svg" alt="green-tick.svg" class="w-20 mx-auto" />
				<div class="flex flex-col gap-2">
					<h1 class="text-center">¡Listo! Tu pago fue <br /> realizado con éxito</h1>
					{#if data.pagoLink.refCodigo}
						<p class="text-center text-sm text-darkGray">Ref. codigo: {data.pagoLink.refCodigo}</p>
					{/if}
					{#if data.pagoLink.refConcepto}
						<p class="text-center text-sm text-darkGray">Ref. concepto: {data.pagoLink.refConcepto}</p>
					{/if}
				</div>

				<Card class="gap-4 !p-8">
					<h1 class="text-center font-popMedium">Pagaste</h1>

					<p class=" inline-flex items-center gap-1 ml-4 mt-4">
						{currency2(data.pagoLink?.pago?.montoDestino).format()}
						{data.pagoLink?.pago?.monedaDestino}
						<img src="/images/monedas/{data.pagoLink?.pago?.monedaDestino}.png" alt="" class="w-5 h-5" />
					</p>
					<p class=" inline-flex items-center gap-1 ml-4 mb-4">
						{currency2(montoOrigen).format()}
						{data.pagoLink?.pago?.monedaOrigen}
						<img src="/images/monedas/{data.pagoLink?.pago?.monedaOrigen}.png" alt="" class="w-5 h-5" />
					</p>

					<button class="mx-auto btn" on:click={() => goto(`${$page.url.pathname}?ticket=true`)}
						>VER COMPROBANTE</button
					>
				</Card>
			</div>
			<img src="/images/caipi-icon.svg" alt="caipi-icon.svg" class="w-20 mx-auto" />
		</section>
	</div>
{:else}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		<Comprobante {data} {comprobanteFile} />
	</div>
{/if}

<style>
	.gradient-background {
		background: linear-gradient(to top, #6b9907 0%, white 50%);
	}
</style>
