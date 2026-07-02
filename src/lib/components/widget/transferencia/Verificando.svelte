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

		return () => clearInterval(interval);
	});
</script>

<Caipi class="sm:w-32 w-24 text-white absolute top-[20%] left-1/2 -translate-x-1/2" />
<section
	class="shadow-md text-white p-8 h-screen flex flex-col max-w-xl mx-auto gap-4 justify-center w-full overflow-hidden bg-gradient-to-t from-brand-dark to-brand-gray text-center font-popMedium text-xl"
>
	{#if !verificado}
		<img src="/images/caipi-loader.gif" alt="" class="mx-auto sm:w-20 w-16" />

		<p class="mx-auto mt-8 text-center font-popMedium max-w-[250px]">
			Estamos validando tus datos...
		</p>
	{:else}
		<img src="/images/thumbs-up.png" alt="verificado ok" class="mx-auto sm:w-24 w-20" />

		<p class="max-w-sm mx-auto text-center font-popMedium">
			¡Gracias! Tu identidad ha sido verificada con éxito.
		</p>

		<button type="submit" class="btn-light mt-4 mx-auto !w-64" on:click={() => invalidateAll()}>
			Continuar
		</button>
	{/if}
</section>
