<script lang="ts">
	import { goto } from '$app/navigation';
	import { MedioPago } from '$lib/models/enums.js';
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	export let data;

	const handleSubmit = ({}) => {
		return async ({ result }: any) => {
			if (result.type === 'success') {
				const medioPago = result.data.pagoLink.medioPago;
				if (medioPago === MedioPago.mercadopago || medioPago === MedioPago.transferencia)
					goto(`/pagos/${data.pagoLink.uuid}/${result.data.pagoLink.medioPago}`);
			} else {
				if (result.data?.error) toast.error(result.data?.error);
			}
		};
	};
</script>

<section
	class="w-full max-w-xl min-h-[calc(100dvh)] mx-auto flex flex-col gap-6 sm:p-8 p-4 shadow-md"
>
	<div class="p-4 mx-auto w-full">
		<button class="flex gap-2 text-xl items-center text-secondary" on:click={() => goto(`/pagos/${data.pagoLink.uuid}`)}>
			<img src="/images/left-arrow1.svg" alt="left-arrow1.svg" class="h-4" /> Atrás
		</button>
		<hr class="border-secondary mx-auto mt-2" />
	</div>
	<div class="w-full mx-auto flex flex-col px-4">
		<h1 class="font-popMedium mb-2">Elegí cómo pagar</h1>
		<p class="">Seleccioná un método de pago</p>

		<div class="flex flex-col gap-4 mt-4">
			<form class="w-full" method="post" use:enhance={handleSubmit} action="?/setMedioPago">
				<button
					class="border rounded-2xl sm:px-8 px-4 py-4 flex gap-4 w-full shadow-lg sm:text-base text-sm items-center"
				>
					<img src="/images/transaction-arrow.svg" alt="arrow" class="h-6" />
					<span>Transferencia bancaria</span>
				</button>
				<input type="text" name="medioPago" hidden value={MedioPago.transferencia} />
			</form>
			<form class="w-full" method="post" use:enhance={handleSubmit} action="?/setMedioPago">
				<button class="border rounded-2xl sm:px-8 px-4 py-4 flex gap-4 w-full shadow-lg">
					<img src="/images/mercadopago.svg" alt="arrow" class="h-6" />
				</button>
				<input type="text" name="medioPago" hidden value={MedioPago.mercadopago} />
			</form>
		</div>
	</div>
</section>
