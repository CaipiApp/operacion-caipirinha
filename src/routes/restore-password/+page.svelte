<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Caipi from '$lib/components/Icons/Caipi.svelte';
	import { t } from '$lib/translate/i18n';
	import { Button, Card, Input, Label } from 'flowbite-svelte';

	export let form;

	let sending = false;
	
	// Redirect to login after successful password restore
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
					{$t('restorePasswordTitle')}
				</h1>
				<p class="text-sm text-gray-500 dark:text-gray-400 text-center">
					{$t('restorePasswordSubtitle')}
				</p>
				
				{#if form?.error}
					<h3 class="text-center text-lg text-red-500">{$t(form?.error)}</h3>
				{/if}
				
				{#if form?.success}
					<h3 class="text-center text-lg text-green-500">{$t('restorePasswordSuccess')}</h3>
				{/if}
				
				<form
					class="space-y-4 md:space-y-6"
					method="POST"
					action="?/restore"
					use:enhance={handleSubmit}
				>
					<div>
						<Label for="email" class="block mb-2">{$t('restorePasswordEmailLabel')}</Label>
						<Input
							type="email"
							name="email"
							id="email"
							placeholder={$t('restorePasswordEmailPlaceholder')}
							required
						/>
					</div>
					
					<Button type="submit" color="primary" class="w-full" disabled={sending}>
						{$t('restorePasswordBtn')}
					</Button>
				</form>
				
				<div class="flex justify-center">
					<a
						href="/login"
						class="text-sm font-medium hover:underline text-primary-700 dark:text-primary-600"
						>{$t('restorePasswordBackToLogin')}</a
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
