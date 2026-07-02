<script lang="ts">
	import { fly } from 'svelte/transition';

	// transferencia
	import Transferencia from '$lib/components/widget/transferencia/Transferencia.svelte';
	import PagoExito from '$lib/components/widget/transferencia/PagoExito.svelte';
	import PagoError from '$lib/components/widget/transferencia/PagoError.svelte';

	// mp
	import TransferenciaMp from '$lib/components/widget/transferenciaMP/TransferenciaMP.svelte';
	import { page } from '$app/stores';

	export let data;
</script>

{#if data.step === 1}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if $page.params.metodo === 'transferencia'}
			<Transferencia
				pagoTransferencia={data.pagoTransferencia}
				lock={data.lock}
			/>
		{:else}
			<TransferenciaMp
				pagoTransferencia={data.pagoTransferencia}
				lock={data.lock}
			/>
		{/if}
	</div>
{/if}

{#if data.step === 2}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		<PagoExito {data} />
	</div>
{/if}

{#if data.step === 3}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		<PagoError pagoTransferencia={data.pagoTransferencia} />
	</div>
{/if}
