<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { EstadoLock, EstadoPagoTransferencia, type Lock, type Transferencia } from '$lib/models';
	import toast from 'svelte-french-toast';
	import { currency2, getMontoOrigen } from '$lib/utils';
	import { onMount } from 'svelte';
	import WaitingPayment from '../WaitingPayment.svelte';
	import RemainingTime from '../remainingTime.svelte';
	import { invalidateAll } from '$app/navigation';
	import * as api from '$lib/api';
	import { PUBLIC_EXTERNAL_API_URL } from '$env/static/public';
	import Caipi from '$lib/components/Icons/Caipi.svelte';

	export let pagoTransferencia: Transferencia;
	export let lock: Lock;

	const titularCuenta = 'Sixalime Sas-Plus Billetera';
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
	class="pt-4 pb-4 px-4 w-full max-w-xl min-h-[calc(100dvh)] mx-auto gap-2 flex flex-col flex-grow justify-between items-center shadow-md"
>
	<div class="flex flex-col flex-grow gap-2 items-center justify-evenly">
    <Caipi class="w-24 text-primary-600" />
			<div class="max-w-md w-full">
				<p class="font-popMedium mx-auto text-xs mt-4 mb-1 text-center">
					Transferí desde una cuenta a tu nombre.
				</p>
				<p class="font-popMedium mx-auto text-xs mb-4 text-center">
					Regresa a esta pantalla para verificar el estado de tu pago.
				</p>
				<Card>
					<div>
						<p class="font-popMedium">Monto</p>
						<div class="flex justify-between items-center">
							<p class="font-popLight break-all inline-flex gap-4">
								{currency2(montoOrigen).format()}
								<span class="flex items-center gap-1 p-0 m-0">
									<img class="rounded-full w-6 h-6" src={'/images/monedas/ARS.png'} alt="moneda " />
									<span class="text-center text-xs p-0 m-0">ARS</span>
								</span>
							</p>
							<hr />

							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<img
								src="/images/bi-copy.svg"
								alt=""
								class="hover:cursor-pointer"
								on:click={() => copyText(String(montoOrigen))}
							/>
						</div>
					</div>
					<hr />
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div>
						<p class="font-popMedium">Alias</p>
						<div class="flex justify-between items-center">
							<p class="font-popLight">{alias}</p>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<img
								src="/images/bi-copy.svg"
								alt=""
								class="hover:cursor-pointer"
								on:click={() => copyText(alias)}
							/>
						</div>
					</div>
					<hr />

					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div>
						<p class="font-popMedium">CVU</p>
						<div class="flex justify-between items-center">
							<p class="font-popLight">{cvu}</p>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<img
								src="/images/bi-copy.svg"
								alt=""
								class="hover:cursor-pointer"
								on:click={() => copyText(cvu)}
							/>
						</div>
					</div>
				</Card>
			</div>
		<Card>
			<p class="font-popMedium text-sm">Titular de la cuenta:</p>
			<p class="font-popLight text-sm">{titularCuenta}</p>
			<p class="font-popLight text-sm">CUIT: {cuitTitular}</p>
		</Card>
		<p class="text-xs font-popLight px-6 max-w-md mt-2">
			* Recordá transferir desde una cuenta a tu nombre y no desde cuentas de terceros. <br /><br />
			* Los depósitos pueden tardar hasta 15 minutos en acreditarse.
		</p>
	</div>
	{#if lock.estado === EstadoLock.pendiente}
		<div class="max-w-md w-full text-primary rounded-xl bg-lightGray py-2 px-4 text-center sm:mb-8 mb-2">
			<RemainingTime expires={lock.expires} />
		</div>
	{/if}

	{#if cambioEstado}
		<WaitingPayment estado={estadoPago} />
	{/if}
</section>
