<script lang="ts">
	import { goto } from '$app/navigation';
	import ArsIcon from '$lib/components/Icons/ArsIcon.svelte';
	import { currency2 } from '$lib/utils.js';
	export let data;

	let viewDetail = false;

	let listo = true;
	$: empImg = data.pagoLink?.cuenta?.empresa?.imagen || '/logo-meta.jpg';
	data?.cotizacion.then(() => (listo = false));
</script>

<section
	class="w-full max-w-xl min-h-[calc(100dvh)] mx-auto flex flex-col gap-4 justify-between shadow-md pb-8"
>
	<div class="relative flex flex-col gap-2">
		<div class="relative w-full h-fit flex flex-col">
			<div class="absolute top-0 w-full bg-gradient-to-b from-darkPrimary to-white h-1/2 z-0"></div>
			<header
				class="z-10 bg-gradient-to-b from-darkPrimary to-secondary py-6 px-5 md:px-10 rounded-b-[32px] text-white flex flex-col gap-5 mx-4"
			>
				<img src="/images/caipi-icon.svg" alt="caipi-icon" class="w-32 mx-auto" />
				<hr class="mx-6" />
				<p class="text-center font-popMedium">Vas a pagar a {data.pagoLink.cuenta?.empresa?.nombre}</p>
				<p class="flex justify-center items-center gap-3 font-popMedium">
					<span class="text-3xl sm:text-4xl md:text-5xl"
						>{currency2(data.pagoLink.pago.montoDestino).format()}</span
					>
					<ArsIcon moneda={data.pagoLink.pago.monedaDestino} />
				</p>
				{#await data.cotizacion}
					<div role="status" class="animate-pulse h-10 flex justify-center items-center gap-1">
						<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-5"></div>
						<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24"></div>
						<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-5"></div>
					</div>
				{:then cotizacion}
					<p class="flex justify-center items-center gap-3 font-popMedium">
						{#if cotizacion.ok}
							<span class=" text-xl">{currency2(cotizacion?.data?.montoOrigen).format()}*</span>
							<ArsIcon moneda={data.pagoLink.pago.monedaOrigen} />
						{:else}
							<span class="text-3xl sm:text-4xl md:text-5xl">Ocurrió un error</span>
						{/if}
					</p>
				{/await}

				<div class="flex items-center gap-2 mx-auto">
					<img src="/images/sin-comisiones.svg" alt="" />
					<p class="text-center font-popMedium">Sin impuestos, sin comisiones</p>
				</div>
			</header>
		</div>
		<div
			class="border rounded-xl border-mediumGray px-6 text-darkGray font-popLight text-sm mx-8 mt-4"
		>
			*El precio puede variar dependiendo de las cotizaciones al momento de realizar un pago.
		</div>
	</div>
	<div class="px-6 mx-5 sm:px-10 py-4 flex flex-col justify-center rounded-2xl shadow-lg">
		<div class="items-center flex gap-2 self-center align-center rounded-lg font-semibold">
			<img src={empImg} alt="Imagen empresa" class="w-20 mx-3 self-center sm:w-24" />
			<ul class=" [&>*]:font-light text-left m-2 font-popLight text-sm sm:text-base">
				<li>{data.pagoLink.cuenta?.empresa?.nombre}</li>
				<li>{data.pagoLink.refCodigo}</li>
				<button
					on:click={() => (viewDetail = !viewDetail)}
					class="flex gap-2 w-fit justify-end items-center pr-4"
				>
					<p class="text-primary text-md">Ver detalles</p>
					<img
						src="/images/right-arrow.svg"
						alt=""
						class={`w-5 ${viewDetail ? '-rotate-90' : 'rotate-90'}`}
					/>
				</button>
			</ul>
		</div>
		{#if viewDetail}
			<div
				class="divide-y my-4 text-sm [&>*:nth-child(even)]:text-primary [&>*:nth-child(odd)]:text-darkGray grid grid-cols-3"
			>
				<span>Empresa</span>
				<span class="col-span-2 text-end border-none">{data.pagoLink.cuenta?.empresa?.nombre}</span>

				<span>Cliente</span>
				<span class="col-span-2 text-end">{data.pagoLink.refNombreCliente}</span>

				<span>Email</span>
				<span class="col-span-2 text-end">{data.pagoLink.refEmailCliente}</span>

				{#if data.pagoLink.refConcepto}
					<span>Concepto</span>
					<span class="col-span-2 text-end">{data.pagoLink.refConcepto}</span>
				{/if}

				{#if data.pagoLink.refArchivo}
					<span>Archivo</span>
					<a href={data.pagoLink.refArchivo} target="_blank" class="underline col-span-2 text-end"
						>Descargar archivo</a
					>
				{/if}
			</div>
		{/if}
	</div>
	<footer class="px-5 md:px-10 flex justify-center">
		<button
			disabled={listo}
			on:click={() => goto(`/pagos/${data.pagoLink.uuid}/metodo`)}
			class="btn disabled:bg-mediumGray disabled:cursor-not-allowed"
		>
			PAGAR
		</button>
	</footer>
</section>

<style>
	.divide-y > * {
		padding: 8px 0px;
		font-family: 'PoppinsLight';
		word-break: break-word;
	}
	.divide-y > *:nth-child(even) {
		font-family: 'PoppinsMedium';
	}
	.underline {
		color: #7ab7ff;
	}

	:global(#nprogress .bar) {
		background: #243386;
	}
	:global(#nprogress .spinner-icon) {
		border-top-color: #243386;
		border-left-color: #243386;
	}
	:global(#nprogress .peg) {
		box-shadow:
			0 0 10px #243386,
			0 0 5px #243386;
	}
</style>
