<script lang="ts">
	import { fade } from 'svelte/transition';
	import { t } from '$lib/translate/i18n';
	import SelectLocales from '$lib/components/SelectLocales.svelte';
	import Caipi from '$lib/components/Icons/Caipi.svelte';
	import { browser } from '$app/environment';

	let showItems = false;

	function handleResize() {
		if (browser && window.innerWidth > 767) {
			showItems = false;
		}
	}
	if (browser) {
		window.addEventListener('resize', handleResize);
	}
</script>

<div class="w-full font-robotoMedium tracking-wider z-50">
	<nav class="w-full max-w-7xl flex flex-col md:flex-row justify-center relative mx-auto">
		<div
			style:box-shadow={showItems ? '0 0 0 9999px rgba(0, 0, 0, 0.50)' : 'none'}
			class:!rounded-b-[0px]={showItems}
			class:!rounded-t-[32px]={showItems}
			class="w-full border-2 border-[#879340] bg-[#414e20] rounded-full sm:py-4 py-2 px-6 lg:px-8 flex justify-between text-white mx-auto items-center z-20"
		>
			<a href="/"><Caipi class="sm:h-7 h-6" /></a>
			<div
				class="flex font-robotoMedium tracking-wider lg:gap-4 gap-2 md:flex-row-reverse items-center"
			>
				{#if !showItems}
					<SelectLocales />
				{/if}
				<div class="hidden md:flex items-center sm:gap-6 gap-4">
					<a class="hover:opacity-70 transition-opacity" href="/#what-is-caipi">
						{$t('navbar.items.btn1')}
					</a>

					<a href="/#benefits" class="hover:opacity-70 transition-opacity">
						{$t('navbar.items.btn2')}
					</a>


					<a href="/terminos" class="hover:opacity-70 transition-opacity">
						{$t('navbar.items.terminos')}
					</a>

					<a href="/login" class="hover:opacity-70 transition-opacity">
						{$t('navbar.items.btn5')}
					</a>
				</div>
				<div class="flex gap-2 md:hidden hover:opacity-70 transition-opacity">
					<button on:click={() => (showItems = !showItems)}>
						<img
							src={showItems ? '/images/landing/x.svg' : '/images/landing/burguer.svg'}
							alt="menu.svg"
							class="h-5"
						/>
					</button>
				</div>
			</div>
		</div>
		{#if showItems}
			<div
				transition:fade
				class="absolute top-full py-8 w-full flex flex-col gap-4 bg-[#3d3d1e] rounded-b-[32px] md:hidden shadow-md border-2 border-[#6b6b3d] border-t-transparent z-20"
			>
				<a
					href="/#what-is-caipi"
					class="text-left mx-8 sm:mx-16 inline-flex gap-2 items-center hover:opacity-70 transition-opacity"
					on:click={() => {
						showItems = false;
					}}
				>
					<img src="/images/left-arrow-white.svg" alt="" class="rotate-180 w-2" />
					{$t('navbar.items.btn1')}
				</a>
				<hr class="mx-8 sm:mx-16" />

				<a
					href="/#benefits"
					class="text-left mx-8 sm:mx-16 inline-flex gap-2 items-center hover:opacity-70 transition-opacity"
					on:click={() => {
						showItems = false;
					}}
				>
					<img src="/images/left-arrow-white.svg" alt="" class="rotate-180 w-2" />
					{$t('navbar.items.btn2')}
				</a>

				<hr class="mx-8 sm:mx-16" />


				<a
					href="/terminos"
					class="text-left mx-8 sm:mx-16 inline-flex gap-2 items-center hover:opacity-70 transition-opacity"
					on:click={() => {
						showItems = false;
					}}
				>
					<img src="/images/left-arrow-white.svg" alt="" class="rotate-180 w-2" />
					{$t('navbar.items.terminos')}
				</a>
				<hr class="mx-8 sm:mx-16" />

				<a
					href="/login"
					class="text-left mx-8 sm:mx-16 inline-flex gap-2 items-center hover:opacity-70 transition-opacity"
					on:click={() => {
						showItems = false;
					}}
				>
					<img src="/images/left-arrow-white.svg" alt="" class="rotate-180 w-2" />
					{$t('navbar.items.btn5')}
				</a>
			</div>
		{/if}
	</nav>
</div>
