<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_WAPP } from '$env/static/public';
	import { EstadoPagoTransferencia, type Transferencia } from '$lib/models';
	import { isMobileDevice } from '$lib/utils';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let pagoTransferencia: Transferencia | undefined;

	let link: string = '';

  onMount(() => {
    link =  isMobileDevice()
      ? `whatsapp://send?phone=${PUBLIC_WAPP}`
      : `https://web.whatsapp.com/send?phone=${PUBLIC_WAPP}`;
  });

	let sending = false;

	const cancelPagoIntento = ({}) => {
		sending = true;
		return async ({ result }: any) => {
			if (result.type === 'success') {
				invalidateAll();
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<section
	class="relative px-4 py-4 sm:py-6 w-full max-w-xl min-h-[calc(100dvh)] mx-auto gap-4 flex flex-col justify-evenly items-center gradient-background shadow-md"
>
	<div class="flex flex-col items-center gap-4 mb-4 max-w-xs text-center">
		<img src="/images/warning.png" alt="" class="w-32" />
		<h1>No te preocupes.</h1>

		<p class="font-popLight">{pagoTransferencia?.errorMsg || "Hubo un problema al procesar el pago."}</p>

		{#if pagoTransferencia?.estado === EstadoPagoTransferencia.cancelado}
			<p class="font-popLight">
				Revisá tu cuenta bancaria para devoluciones, la que ingresaste en el registro, 
				y cualquier inconveniente comunicate con el soporte haciendo clic en el botón de abajo.
			</p>
		{:else}
			<p class="font-popLight">
				Por favor comunicate con el soporte, haciendo clic en el botón de abajo, para resolver tu inconveniente.
			</p>
		{/if}
		<div class="flex flex-col w-full items-center gap-4 mt-4">
			<a class="btn text-center" href={link} target="_blank"> Contactar Soporte</a>
		</div>
	</div>

	<img src="/images/caipi-icon.svg" alt="caipi-icon.svg" class="w-24" />
</section>

<style>
	.gradient-background {
		background: linear-gradient(to top, #878787 0%, white 50%);
	}
</style>
