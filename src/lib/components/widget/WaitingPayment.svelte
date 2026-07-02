<script lang="ts">
	import { fade } from 'svelte/transition';
	import { EstadoPagoTransferencia } from '$lib/models';
	import { onMount } from 'svelte';

	export let estado: EstadoPagoTransferencia | undefined;
	export let imgsrc: string = '/images/rodaja.svg';
	let messageIndex = 0;
	let currentMessage = 'Estamos procesando tu pago, ya falta poco.';

	const fiatReceivedMessages = [
		'Ya hemos recibido tu dinero, te avisaremos cuando el destinatario reciba su pago.',
		'Verificando detalles...',
		'En proceso...',
		'Datos confirmados.',
		'Procesando pago...',
		'Enviando dinero...',
		'Casi listo...',
		'Pago recibido por el destinatario.',
		'Transacción exitosa.'
	];

	function updateMessage() {
		if (estado === 'proceso') return;

		currentMessage = fiatReceivedMessages[messageIndex % fiatReceivedMessages.length];
		messageIndex++;
	}

	onMount(() => {
		const interval = setInterval(updateMessage, 2000);
		return () => clearInterval(interval);
	});

	// Set the initial message
	updateMessage();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="modal-background" transition:fade role="button " tabindex="0">
	<div
		class="flex flex-col gap-4 items-center text-center bg-white max-w-sm w-full mx-10 p-6 border rounded-3xl shadow-md h-[200px] justify-center"
	>
		{#if estado !== EstadoPagoTransferencia.finalizado}
			<img src={imgsrc} alt="" class="spinner w-24" />
			<p>{currentMessage}</p>
		{:else}
			<div>
				<img transition:fade src="/images/green-tick.svg" alt="" class="mx-auto mb-6" />
				<p transition:fade>¡Listo! Tu pago fue realizado con éxito</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.spinner {
		width: 64px;
		height: 64px;
		animation: spin 3s linear infinite;
	}
</style>
