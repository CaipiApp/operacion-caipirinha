<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Caipi from '$lib/components/Icons/Caipi.svelte';
	import { t } from '$lib/translate/i18n';
	import { Button, Card, Input, Label } from 'flowbite-svelte';

	export let form;

	let sending = false;
	
	// Get token from URL query params
	$: token = $page.url.searchParams.get('token');
	
	// Redirect to login after successful password change
	$: if (form?.success) {
		setTimeout(() => {
			goto('/login');
		}, 1000);
	}
	
	const handleSubmit = () => {
		sending = true;
		return async ({ result, update }: { result: any; update: any }) => {
			sending = false;
			await update({ reset: false });
		};
	};
</script>

<div class="gradient-bg h-screen overflow-hidden relative">
	<div class="flex flex-col items-center justify-center gap-6 px-6 py-8 mx-auto h-screen lg:py-0">
		<Caipi class="text-white w-32" />
		<Card size="md">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
					{$t('changePasswordTitle')}
				</h1>
				<p class="text-sm text-gray-500 dark:text-gray-400 text-center">
					{$t('changePasswordSubtitle')}
				</p>
				
				{#if !token}
					<h3 class="text-center text-lg text-red-500">{$t('tokenRequired')}</h3>
				{/if}
				
				{#if form?.error}
					<h3 class="text-center text-lg text-red-500">{$t(form?.error)}</h3>
				{/if}
				
				{#if form?.success}
					<h3 class="text-center text-lg text-green-500">{$t('changePasswordSuccess')}</h3>
				{/if}
				
				<form
					class="space-y-4 md:space-y-6"
					method="POST"
					action="?/change"
					use:enhance={handleSubmit}
				>
					<!-- Hidden token field -->
					<input type="hidden" name="token" value={token || ''} />
					
					<div>
						<Label for="password" class="block mb-2">{$t('changePasswordNewLabel')}</Label>
						<Input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							required
						/>
					</div>
					
					<div>
						<Label for="confirmPassword" class="block mb-2">{$t('changePasswordConfirmLabel')}</Label>
						<Input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							placeholder="••••••••"
							required
						/>
					</div>
					
					<Button type="submit" color="primary" class="w-full" disabled={sending || !token}>
						{$t('changePasswordBtn')}
					</Button>
				</form>
				
				<div class="flex justify-center">
					<a
						href="/login"
						class="text-sm font-medium hover:underline text-primary-700 dark:text-primary-600"
						>{$t('changePasswordBackToLogin')}</a
					>
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
