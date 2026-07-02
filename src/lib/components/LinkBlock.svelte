<script lang="ts">
	import { PUBLIC_APP_URL } from '$env/static/public';
	import CopyBtn from './buttons/CopyBtn.svelte';
	import ShareBtn from './buttons/ShareBtn.svelte';
	import QrCodeImg from './QrCodeImg.svelte';

	export let pago: any;

	$: pagoLink = pago?.pagoLink;
	$: pagoQr = pago?.pagoQr;
	$: link =  pagoLink 
		? `${PUBLIC_APP_URL}/pagos/${pagoLink?.uuid}` 
		: pagoQr
			? pagoQr.qr
			:  `${PUBLIC_APP_URL}/pagos/qr/${pago?.uuid}` ;

</script>

<div class="w-full flex flex-col gap-2 justify-center items-center">
	{#if pago.pagoQr}
		<QrCodeImg pagoQr={pago.pagoQr} pago={pago} on:reload />
	{/if}

	<div class='flex items-center justify-center gap-2'>

		<CopyBtn link={link} />

		<ShareBtn link={link} />
	
	</div>
</div>
