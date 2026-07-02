<script lang="ts">
	import toast from 'svelte-french-toast';
	import CardMp from '../CardMP.svelte';
	import RemainingTime from '../remainingTime.svelte';
	import { EstadoLock, EstadoPagoTransferencia, type Lock, type Transferencia } from '$lib/models';
	import { currency2, getMontoOrigen } from '$lib/utils';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import * as api from '$lib/api';
	import { PUBLIC_EXTERNAL_API_URL } from '$env/static/public';
	import WaitingPayment from '../WaitingPayment.svelte';

	export let pagoTransferencia: Transferencia;
	export let lock: Lock;

	const titularCuenta = 'Sixalime S.A.S. - Plus Billetera';
	const cuitTitular = '30-71678854-3';
	const cvu = '0000234100000000000215';
	const alias = 'caipi.app';

	let interval: any;
	let estadoPago = pagoTransferencia.estado;
	let cambioEstado =
		estadoPago != EstadoPagoTransferencia.proceso &&
		estadoPago != EstadoPagoTransferencia.cancelado &&
		estadoPago != EstadoPagoTransferencia.rechazado;

	$: montoOrigen = getMontoOrigen(lock);

	// $: link = isMobileDevice()
	// 	? `mercadopago://transfer?prefill_alias=${alias}&prefill_amount=${montoOrigen}`
	// 	: `https://www.mercadopago.com.ar/money-transfer?prefill_alias=${alias}&prefill_amount=${montoOrigen}`;

	function copyText(text: string) {
		navigator.clipboard.writeText(text);
		toast.success('Copiado al portapapeles.');
	}

	async function getPago() {
		const resPagoTx = await api.get(
			{ fetch, endpoint: `pagos/transferencia/${pagoTransferencia?.id}` },
			PUBLIC_EXTERNAL_API_URL
		);
		if (!resPagoTx.ok) return;

		const pagoTx = resPagoTx.data as Transferencia;
		estadoPago = pagoTx.estado;
		cambioEstado =
			estadoPago != EstadoPagoTransferencia.proceso &&
			estadoPago != EstadoPagoTransferencia.cancelado &&
			estadoPago != EstadoPagoTransferencia.rechazado;

		if (pagoTx.estado === EstadoPagoTransferencia.proceso) return;

		if (
			estadoPago === EstadoPagoTransferencia.finalizado ||
			estadoPago === EstadoPagoTransferencia.rechazado ||
			estadoPago === EstadoPagoTransferencia.cancelado
		) {
			setTimeout(async () => {
				clearInterval(interval);
				invalidateAll();
			}, 1500);
		}else if(lock.estado === EstadoLock.pendiente && lock.expires <= Math.floor(Date.now() / 1000)){
			invalidateAll();
		}
	}

	onMount(() => {
		// recardar data para ver si hay cambios
		interval = setInterval(async () => {
			getPago();
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<section
	class="max-w-xl min-h-[calc(100dvh)] mx-auto flex flex-col flex-grow justify-between pt-4 pb-4 bg-lightGray"
>
	<div class="flex flex-col flex-grow justify-between gap-4 p-4">
		<img src="/images/mercadopago2.png" alt="mercadopago.svg" class="h-10 w-[162px] mx-auto" />
		<div class="w-full flex flex-col gap-2">
			<p class="font-popMedium text-xs mt-4 mb-1 text-center">
				Transferí desde una cuenta a tu nombre.
			</p>
			<p class="font-popMedium text-xs mb-4 text-center">
				Regresa a esta pantalla para verificar el estado de tu pago.
			</p>
			<CardMp class="text-center flex flex-col gap-2">
				<div class="flex justify-between items-center sm:px-12 px-4">
					<div class="flex flex-col text-left">
						<p class="font-popMedium">Monto</p>
						<div class="font-popLight break-all inline-flex gap-4">
							{currency2(montoOrigen).format()}
							<span class="flex items-center gap-1 p-0 m-0">
								<img class="rounded-full w-6 h-6" src={'/images/monedas/ARS.png'} alt="moneda " />
								<span class="text-center text-xs p-0 m-0">ARS</span>
							</span>
						</div>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<img
						src="/images/bi-copyMP.svg"
						alt=""
						class="hover:cursor-pointer w-6"
						on:click={() => copyText(String(montoOrigen))}
					/>
				</div>
				<hr />
				<div class="flex flex-col gap-4 sm:px-8">
					<div class="flex w-full px-4 justify-between">
						<div class="flex flex-col text-left">
							<p class="font-popMedium">Alias</p>
							<p class="break-all font-popLight">{alias}</p>
						</div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<img
							src="/images/bi-copyMP.svg"
							alt=""
							class="hover:cursor-pointer w-6"
							on:click={() => copyText(alias)}
						/>
					</div>
				</div>
				<hr />
				<div class="flex flex-col gap-4 sm:px-8">
					<div class="flex w-full px-4 justify-between">
						<div class="flex flex-col text-left">
							<p class="font-popMedium">CVU</p>
							<p class="break-all font-popLight">{cvu}</p>
						</div>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<img
							src="/images/bi-copyMP.svg"
							alt=""
							class="hover:cursor-pointer w-6"
							on:click={() => copyText(cvu)}
						/>
					</div>
				</div>
			</CardMp>

			<!-- "https://www.mercadopago.com.ar/money-transfer?prefill_alias=capi.app&prefill_amount=10.50" -->
		</div>
		<!-- <a -->
		<!-- 	class="py-4 border rounded-md bg-mp text-white font-popMedium text-center inline-flex justify-between gap-1 px-8 items-center" -->
		<!-- 	href={link} -->
		<!-- 	target="_blank" -->
		<!-- 	><div class="inline-flex sm:gap-8 gap-2 items-center"> -->
		<!-- 		<img src="/images/mercadopago-circle.svg" alt="" /> -->
		<!-- 		<p class="w-fit">IR A MERCADO PAGO</p> -->
		<!-- 	</div> -->
		<!-- 	<img src="/images/left-arrow-white.svg" alt="" class="rotate-180" /></a -->
		<!-- > -->
		<CardMp>
			<div class="flex flex-col max-w-sm text-sm font-popLight sm:ml-12 ml-4">
				<p class="font-popMedium text-xs mb-1">Titular de la cuenta:</p>
				<p class="mb-1 text-xs">{titularCuenta}</p>
				<p>CUIT: {cuitTitular}</p>
			</div>
		</CardMp>
		
		<hr class=" mx-auto w-full border-mediumGray" />
		<div class="flex flex-col gap-6 mx-auto">
			<div class="text-sm font-popLight text-darkGray">
				<p>* Recordá transferir desde una cuenta a tu nombre y no desde cuentas de terceros.</p>
				<br />
				<p>* Los depósitos pueden tardar hasta 15 minutos en acreditarse.</p>
			</div>
		</div>
		{#if lock.estado === EstadoLock.pendiente}
			<CardMp>
				<div class="text-darkGray text-center">
					<RemainingTime expires={lock.expires} />
				</div>
			</CardMp>
		{/if}
	</div>
	{#if cambioEstado}
		<WaitingPayment estado={estadoPago} />
	{/if}
</section>
