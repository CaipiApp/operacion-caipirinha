<script lang="ts">
	import { browser } from '$app/environment';
	import { PUBLIC_APP_URL, PUBLIC_WAPP } from '$env/static/public';
	import { isMobileDevice } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let link: string = '';

	onMount(() => {
		link = isMobileDevice()
			? `whatsapp://send?phone=${PUBLIC_WAPP}`
			: `https://web.whatsapp.com/send?phone=${PUBLIC_WAPP}`;
	});

	function handleClick() {
		if (browser) window.location.reload();
	}
	function handleClick404() {
		if (browser) window.location.href = PUBLIC_APP_URL;
	}
</script>

<section
	class="relative px-4 py-4 sm:py-6 w-full max-w-xl min-h-[calc(100dvh)] mx-auto gap-4 flex flex-col justify-evenly items-center gradient-background shadow-md"
>
	<div class="flex flex-col items-center gap-4 mb-4 max-w-xs text-center">
		<img src="/images/warning.png" alt="" class="w-32" />

		<h1 class="mb-2">No te preocupes</h1>

		{#if $page.status === 404}
			<p class="font-popLight">No encontramos la página que buscabas.</p>

			<button class="btn text-center mt-4" on:click={handleClick404}>Ir al inicio</button>
		{:else}
			<p class="font-popLight">
				En caso de haber sido un error de red, probá recargando la página. <br /> Sino, por favor hacé
				clic en el botón de abajo para comunicarte con soporte y resolver tu inconveniente.
			</p>

			<div class="flex flex-col w-full items-center gap-4 mt-4">
				<button class="btn text-center" on:click={handleClick}>Volver a intentar</button>
				<a class="btn-light text-center" href={link} target="_blank"> Contactar Soporte</a>
			</div>
		{/if}
	</div>
	<img src="/images/caipi-icon.svg" alt="caipi-icon.svg" class="w-24" />
</section>

<style>
	.gradient-background {
		background: linear-gradient(to top, #878787 0%, white 50%);
	}
</style>
