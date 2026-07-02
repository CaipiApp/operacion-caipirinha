<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Caipi from '$lib/components/Icons/Caipi.svelte';
	import { t } from '$lib/translate/i18n';
	import { Button, Card, Input, Label, Modal } from 'flowbite-svelte';

	export let form;

	let sending = false;
	let showConfirmModal = false;
	let isLoggedIn = false;
	let accountDeleted = false;

	// Check if user just logged in successfully
	$: if (form?.success && form?.loggedIn) {
		isLoggedIn = true;
	}

	// Check if account was deleted successfully
	$: if (form?.success && form?.accountDeleted) {
		accountDeleted = true;
		showConfirmModal = false;
		
		// Redirect to home after 1.5 seconds
		setTimeout(() => {
			goto('/');
		}, 1500);
	}

	const handleLogin = () => {
		sending = true;
		return async ({ result, update }: any) => {
			sending = false;
			await update({ reset: false });
		};
	};

	const handleDeactivate = () => {
		sending = true;
		return async ({ result, update }: any) => {
			sending = false;
			await update({ reset: false });
		};
	};

	const openConfirmModal = () => {
		showConfirmModal = true;
	};

	const closeConfirmModal = () => {
		showConfirmModal = false;
	};
</script>

<svelte:head>
	<title>{$t('deleteAccountTitle')} - Caipi</title>
</svelte:head>

<div class="gradient-bg h-screen overflow-hidden relative">
	<div class="flex flex-col items-center justify-center gap-6 px-6 py-8 mx-auto h-screen lg:py-0">
		<Caipi class="text-white w-32" />
		
		{#if accountDeleted}
			<!-- Success Message -->
			<Card size="md">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<div class="text-center">
						<div class="mx-auto mb-4 text-green-500 w-12 h-12 flex items-center justify-center text-3xl">
							✅
						</div>
						<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							{$t('deleteAccountSuccess')}
						</h1>
						<p class="mt-4 text-gray-600 dark:text-gray-400">
							Redirigiendo al inicio...
						</p>
					</div>
				</div>
			</Card>
		{:else if !isLoggedIn}
			<!-- Login Form -->
			<Card size="md">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
						{$t('deleteAccountTitle')}
					</h1>
					<p class="text-center text-gray-600 dark:text-gray-400">
						{$t('deleteAccountLoginMessage')}
					</p>
					
					{#if form?.error}
						<h3 class="text-center text-lg text-red-500">{$t(form?.error)}</h3>
					{/if}
					
					<form
						class="space-y-4 md:space-y-6"
						method="POST"
						action="?/login"
						use:enhance={handleLogin}
					>
						<div>
							<Label for="email" class="block mb-2">{$t('loginEmailLabel')}</Label>
							<Input
								type="email"
								name="email"
								id="email"
								placeholder={$t('loginEmailPlaceholder')}
								required
							/>
						</div>
						<div>
							<Label for="password" class="block mb-2">
								{$t('loginPasswordLabel')}
							</Label>
							<Input type="password" name="password" id="password" placeholder="••••••••" required />
						</div>
						
						<Button type="submit" color="primary" class="w-full" disabled={sending}>
							{$t('loginBtn')}
						</Button>
						
						<div class="flex justify-center">
							<a
								href="/"
								class="text-sm font-medium hover:underline text-primary-700 dark:text-primary-600"
							>
								{$t('cancelBtn')}
							</a>
						</div>
					</form>
				</div>
			</Card>
		{:else}
			<!-- Account Deletion Confirmation -->
			<Card size="md">
				<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<div class="text-center">
						<div class="mx-auto mb-4 text-red-500 w-12 h-12 flex items-center justify-center text-3xl">
							⚠️
						</div>
						<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							{$t('deleteAccountConfirmTitle')}
						</h1>
						<p class="mt-4 text-gray-600 dark:text-gray-400">
							{$t('deleteAccountWarningMessage')}
						</p>
					</div>
					
					{#if form?.error && isLoggedIn}
						<h3 class="text-center text-lg text-red-500">{$t(form?.error)}</h3>
					{/if}
					
					<div class="flex gap-4">
						<Button color="light" class="flex-1" href="/">
							{$t('cancelBtn')}
						</Button>
						<Button color="red" class="flex-1" on:click={openConfirmModal}>
							{$t('deleteAccountBtn')}
						</Button>
					</div>
				</div>
			</Card>
		{/if}
	</div>
</div>

<!-- Confirmation Modal -->
<Modal bind:open={showConfirmModal} size="xs" autoclose={false} class="w-full">
	<div class="text-center">
		<div class="mx-auto mb-4 text-red-500 w-12 h-12 flex items-center justify-center text-3xl">
			⚠️
		</div>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{$t('deleteAccountFinalConfirmation')}
		</h3>
		<form method="POST" action="?/deactivateAccount" use:enhance={handleDeactivate}>
			<div class="flex justify-center gap-4">
				<Button color="light" on:click={closeConfirmModal}>
					{$t('cancelBtn')}
				</Button>
				<Button color="red" type="submit" disabled={sending}>
					{$t('deleteAccountConfirmBtn')}
				</Button>
			</div>
		</form>
	</div>
</Modal>

<style>
	/* Gradient background class */
	.gradient-bg {
		background: var(--background-caipi);
		background-image: var(--background-gradient-caipi);
	}
</style>