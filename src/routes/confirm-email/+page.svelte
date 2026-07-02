<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Caipi from '$lib/components/Icons/Caipi.svelte';
	import { t } from '$lib/translate/i18n';
	import { Button, Card } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	
	// Get email from URL query params
	$: email = $page.url.searchParams.get('email');
	
	// Redirect to login after successful email confirmation (only on client)
	onMount(() => {
		if (browser && data?.success) {
			setTimeout(() => {
				goto('/login');
			}, 3000);
		}
	});
</script>

<svelte:head>
	<title>{$t('confirmEmailTitle')}</title>
</svelte:head>

<div class="gradient-bg h-screen overflow-hidden relative">
	<div class="flex flex-col items-center justify-center gap-6 px-6 py-8 mx-auto h-screen lg:py-0">
		<Caipi class="text-white w-32" />
		<Card size="md">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
					{$t('confirmEmailTitle')}
				</h1>
				
				{#if !email}
					<h3 class="text-center text-lg text-red-500">{$t('emailRequired')}</h3>
				{:else if data?.success}
					<div class="text-center">
						<div class="mb-4">
							<svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<h3 class="text-center text-lg text-green-500 mb-4">{$t('confirmEmailSuccess')}</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
							{$t('confirmEmailSuccessMessage')}
						</p>
						<p class="text-sm text-gray-400 dark:text-gray-500 text-center">
							{$t('confirmEmailRedirectMessage')}
						</p>
					</div>
				{:else}
					<div class="text-center">
						<div class="mb-4">
							<svg class="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
							</svg>
						</div>
						<h3 class="text-center text-lg text-red-500 mb-4">{$t('confirmEmailError')}</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
							{$t('confirmEmailErrorMessage')}
						</p>
					</div>
				{/if}
				
				<div class="flex justify-center gap-4">
					{#if data?.success}
						<Button href="/login" color="primary">
							{$t('confirmEmailGoToLogin')}
						</Button>
					{:else}
						<Button href="/" color="alternative">
							{$t('confirmEmailGoToHome')}
						</Button>
						<Button href="/login" color="primary">
							{$t('confirmEmailGoToLogin')}
						</Button>
					{/if}
				</div>
			</div>
		</Card>
	</div>
</div>

<style>
	/* Gradient background class */
	.gradient-bg {
		background: var(--background-caipi);
		background-image: var(--background-gradient-caipi);
	}
</style>
