<script lang="ts">
	import { fly } from 'svelte/transition';

	// transferencia
	import CuilForm from '$lib/components/widget/transferencia/CUILForm.svelte';
	import PagadorForm from '$lib/components/widget/transferencia/PagadorForm.svelte';
	import DniForm from '$lib/components/widget/transferencia/DniForm.svelte';
	import { DocType } from '$lib/models';
	import Verificando from '$lib/components/widget/transferencia/Verificando.svelte';
	import CBUForm from '$lib/components/widget/transferencia/CBUForm.svelte';

	// mp
	import CuilFormMp from '$lib/components/widget/transferenciaMP/CUILFormMP.svelte';
	import PagadorFormMp from '$lib/components/widget/transferenciaMP/PagadorFormMP.svelte';
	import CbuFormMp from '$lib/components/widget/transferenciaMP/CBUFormMP.svelte';
	import DniFormMp from '$lib/components/widget/transferenciaMP/DniFormMP.svelte';
	import VerificandoMp from '$lib/components/widget/transferenciaMP/VerificandoMP.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	function goBack(){
		if(data.step === 1){
			if(data.uuid) return goto(`/pagos/${data.uuid}/metodo`);
			return goto('/');
		}

		const url = $page.url.searchParams;
		url.delete('cuil');

		return goto(`${$page.url.pathname}?${url}`, {replaceState: true, invalidateAll: true});
	}

</script>

{#if data.step === 1}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if data.medioPago === 'transferencia'}
			<CuilForm
				error={data.error}
				on:goBack={goBack}
			/>
		{:else}
			<CuilFormMp
				error={data.error}
				on:goBack={goBack}
			/>
		{/if}
	</div>
{/if}

{#if data.step === 2}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if data.medioPago === 'transferencia'}
			<PagadorForm
				persona={data.persona}
				paises={data.paises}
				on:goBack={goBack}
			/>
		{:else}
			<PagadorFormMp
				persona={data.persona}
				paises={data.paises}
				on:goBack={goBack}
			/>
		{/if}
	</div>
{/if}

{#if data.step === 3}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if data.medioPago === 'transferencia'}
			<CBUForm on:goBack={goBack} />
		{:else}
			<CbuFormMp on:goBack={goBack} />
		{/if}
	</div>
{/if}

{#if data.step === 4}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if data.medioPago === 'transferencia'}
			<DniForm
				defaultImgPath="/images/dni-front.png"
				title="Sacá una foto del frente de tu documento"
				subtitle={'Solo un paso más...'}
				docType={DocType.DNI_FRONT}
				fileName="dni_front.png"
				cuil={data.pagador?.cuil || ''}
				lastDni={data.lastDni}
				on:goBack={goBack}
			/>
		{:else}
			<DniFormMp
				defaultImgPath="/images/dni-front.png"
				title="Sacá una foto del frente de tu documento"
				subtitle={'Solo un paso más...'}
				docType={DocType.DNI_FRONT}
				fileName="dni_front.png"
				cuil={data.pagador?.cuil || ''}
				lastDni={data.lastDni}
				on:goBack={goBack}
			/>
		{/if}
	</div>
{/if}

{#if data.step === 5}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if data.medioPago === 'transferencia'}
			<DniForm
				defaultImgPath="/images/dni-back.png"
				title="Dorso DNI"
				subtitle={'Solo un poco más...'}
				docType={DocType.DNI_BACK}
				fileName="dni_back.png"
				cuil={data.pagador?.cuil || ''}
				lastDni={data.lastDni}
				on:goBack={goBack}
			/>
		{:else}
			<DniFormMp
				defaultImgPath="/images/dni-back.png"
				title="Dorso DNI"
				subtitle={'Solo un poco más...'}
				docType={DocType.DNI_BACK}
				fileName="dni_back.png"
				cuil={data.pagador?.cuil || ''}
				lastDni={data.lastDni}
				on:goBack={goBack}
			/>
		{/if}
	</div>
{/if}

{#if data.step === 6}
	<div in:fly={{ x: '-100%', duration: 500 }}>
		{#if data.medioPago === 'transferencia'}
			<Verificando />
		{:else}
			<VerificandoMp />
		{/if}
	</div>
{/if}
