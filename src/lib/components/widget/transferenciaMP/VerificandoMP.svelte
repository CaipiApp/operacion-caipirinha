<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import * as api from '$lib/api';
	import { PUBLIC_EXTERNAL_API_URL } from '$env/static/public';
	import { isDocumentRejected } from '$lib/utils';
	import type { Document } from '$lib/models';
	import Caipi from '$lib/components/Icons/Caipi.svelte';

	let verificado = false;
	let interval: any;

	onMount(() => {
		interval = setInterval(async () => {
			const [resVerificado, getDocumentos] = await Promise.all([
				api.get(
					{ fetch, endpoint: `pagador/documentation/${$page.data.pagador.cuil}/isValidated` },
					PUBLIC_EXTERNAL_API_URL
				),
				api.get(
					{ fetch, endpoint: `pagador/documentation/${$page.data.pagador.cuil}/status` },
					PUBLIC_EXTERNAL_API_URL
				)
			]);

			if (resVerificado.ok && resVerificado.data?.isValidated) {
				verificado = resVerificado.data.isValidated;
				clearInterval(interval);
			}

			if (!getDocumentos.ok) return;

			const documentos = getDocumentos.data as Document[];
			const isRejected = isDocumentRejected(documentos);

			if (isRejected) invalidateAll();
		}, 3000);

		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});
</script>

<Caipi class="sm:w-32 w-24 text-white absolute top-0 left-1/2 -translate-x-1/2" />
<section
	class="shadow-md h-screen mx-auto max-w-xl flex flex-col gap-4 justify-center w-full overflow-hidden text-center font-popMedium text-xl relative"
>
	<div class="bg-gradient-to-b from-mp to-white absolute top-0 h-1/3 w-full z-0"></div>
	{#if !verificado}
		<img src="/images/caipi-loader.gif" alt="" class="mx-auto spinner sm:w-20 w-16" />
		<p class="mx-auto text-center font-popMedium max-w-[250px] mt-4 text-lg sm:text-xl">
			Estamos validando tus datos...
		</p>
	{:else}
		<img src="/images/green-tick.svg" alt="verificado ok" class="mx-auto sm:w-20 w-16" />
		<div>
			<p class="mx-auto text-center font-popMedium text-lg sm:text-xl">
				¡Gracias! Tu identidad ha sido
			</p>
			<p class="mx-auto text-lg sm:text-xl">verificada con éxito.</p>
		</div>
		<div class="mt-4 mx-auto">
			<button type="submit" class="btn-mp !w-64 !p-2" on:click={() => invalidateAll()}>
				Continuar
			</button>
		</div>
	{/if}
</section>
