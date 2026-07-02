<script lang="ts">
	import { EstadoPagoQr, type Pago, type PagoQr } from "$lib/models";
	import dayjs from "dayjs";
  import QRCode from 'qrcode';
	import { onMount } from "svelte";
	import WarningIcon from "./Icons/WarningIcon.svelte";
	import ErrorIcon from "./Icons/ErrorIcon.svelte";
	import SuccessIcon from "./Icons/SuccessIcon.svelte";
  import { PUBLIC_EXTERNAL_API_URL } from '$env/static/public';
	import { t } from '$lib/translate/i18n';
	import * as api from '$lib/api';
	import RemainingTime from "./widget/remainingTime.svelte";
	import PagoQrCountDown from "./PagoQrCountDown.svelte";

  export let pagoQr: PagoQr;
	export let pago: Pago;
  
  let qrUrl = ""
	let interval: any;
	export let textColor = 'text-gray-900 dark:text-gray-300';
  
  $: QRCode.toDataURL(pagoQr.qr).then((url: string) => { qrUrl = url; }).catch((err: any) => { console.error("error qr url", err)});
  // $: statusColor = pagoQr.estado === EstadoPagoQr.

  onMount(() => {
		// recardar data para ver si hay cambios
		interval = setInterval(async () => {
      getPago()
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

  async function getPago() {
		const resPagoQr = await api.get(
			{ fetch, endpoint: `pagos/qr/${pagoQr.id}` },
			PUBLIC_EXTERNAL_API_URL
		);
		if (!resPagoQr.ok) return;

		pagoQr = resPagoQr.data as PagoQr;
		
	}

	onMount(() => {
		// recardar data para ver si hay cambios
		interval = setInterval(async () => {
			getPago();
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});

  function getStatus(pagoQr: PagoQr){
    if(pagoQr.estado === EstadoPagoQr.proceso && pagoQr.expires <= dayjs().unix()){
      return {color: 'text-yellow-500', label: 'newPaymentModalStatusExpired', component: WarningIcon}
    }

    if(pagoQr.estado === EstadoPagoQr.finalizado) return {color: 'text-green-500', label: 'newPaymentModalStatusCompleted', component: SuccessIcon}

    if(
      pagoQr.estado === EstadoPagoQr.cancelado || 
      pagoQr.estado === EstadoPagoQr.rechazado || 
      pagoQr.estado === EstadoPagoQr.amountUsdtTransferredFailed ||
      pagoQr.estado === EstadoPagoQr.comisionUsdtTransferredFailed ||
      pagoQr.estado === EstadoPagoQr.swapExecutedFailed ||
      pagoQr.estado === EstadoPagoQr.usdtReceivedFailed 
    ){
      return {color: 'text-red-500', label: 'newPaymentModalStatusFailed', component: ErrorIcon}
    }
  }

  $: status = getStatus(pagoQr);
		
</script>

{#if status}
  <span class="flex max-w-fit gap-1 items-center font-bold bg-gray-200 px-2 py-1 rounded-xl {status.color} mx-auto">
    <svelte:component this={status.component} /> {$t(status.label)}
  </span>
{/if}

<ul class="w-full max-w-[350px] mx-auto {textColor}">
	<li class="flex justify-between"><span>{$t('newPaymentModalAmount')}:</span> <span>ARS {pago.montoDestino}</span></li>
	<li class="flex justify-between"><span>{$t('newPaymentModalAmountPix')}:</span> <span>BRL ${pagoQr.total_brl}</span></li>
	<li class="flex justify-between"><span>{$t('newPaymentModalConcept')}:</span> <span>{pagoQr.concepto}</span></li>
</ul>

<div class=" bg-gray-200 dark:bg-gray-900 rounded-lg p-4">
  <img src={qrUrl} alt="qr code" class="w-[350px]">
</div>

<PagoQrCountDown expires={pagoQr.expires} textColor={textColor} />


