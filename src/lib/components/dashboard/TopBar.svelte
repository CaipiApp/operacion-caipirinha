<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { openSidebar } from '$lib/components/dashboard/store';
	import Dropdown from '../Dropdown.svelte';
	import { t, supportedLocales } from '$lib/translate/i18n';
	import { invalidateAll } from '$app/navigation';
	import { Button, DarkMode } from 'flowbite-svelte';

	$: user = $page.data.user;
	$: userImage = user?.empresas?.[0]?.imagen || '/images/avatar-default.svg';
	let logOutForm: HTMLFormElement | null = null;

	function handleLogOut(e: any) {
		e.preventDefault();
		logOutForm?.requestSubmit();
	}

	let sending = false;
	async function setLocale(key: string) {
		sending = true;
		const form = new FormData();
		form.set('locale', key);
		await fetch('/?/setLocale', { method: 'post', body: form });
		await invalidateAll();
		sending = false;
	}
</script>

<header class="h-20 items-center relative z-10">
	<div
		class="flex flex-center flex-col h-full justify-center mx-auto relative px-3 text-white z-10"
	>
		<div class="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 lg:max-w-68">
			<div class="flex group h-full items-center relative w-12">
				<button
					type="button"
					aria-expanded="false"
					aria-label="Toggle sidenav"
					on:click={openSidebar}
					class="text-4xl text-gray-900 dark:text-white focus:outline-none"
				>
					&#8801;
				</button>
			</div>
			<div class="flex items-center justify-end ml-5 p-1 relative w-full sm:mr-0 sm:right-auto">
				<span class="block relative mr-8">
					<DarkMode />
				</span>
				<span class="block relative mr-8">
					<Dropdown>
						<Button color="alternative" slot="button" class="flex gap-2">
							<img src="/images/landing/{$page.data.locale}.png" alt="" class="w-4 h-4" />
							<p class="uppercase">
								{$page.data.locale == 'pt' ? 'br' : $page.data.locale}
							</p>
							<div
								class="dark:bg-white bg-gray-900 w-2 h-2"
								style="clip-path: polygon(0 0, 50% 100%, 100% 0);"
							></div>
						</Button>
						<svelte:fragment slot="links">
							{#each supportedLocales as key}
								{#if key != $page.data.locale}
									<button
										class="flex items-center gap-2 w-full py-1 dark:text-gray-300 text-gray-600 hover:text-white hover:bg-gray-300 dark:hover:bg-[#2d3748] uppercase text-left px-4"
										on:click={() => setLocale(key)}
										disabled={sending}
									>
										<img src="/images/landing/{key}.png" alt="" class="w-4 h-4" />
										<span>{key == 'pt' ? 'br' : key}</span>
									</button>
								{/if}
							{/each}
						</svelte:fragment>
					</Dropdown>
				</span>

				<span class="block relative">
					<Dropdown>
						<img
							slot="button"
							class="w-10 h-10 rounded-full text-gray-900 bg-gray-600"
							src={userImage}
							alt={user?.name}
						/>
						<svelte:fragment slot="links">
							<a
								href="/admin/profile"
								class="block px-4 py-2 dark:text-gray-300 text-gray-600 hover:text-white hover:bg-gray-300 dark:hover:bg-[#2d3748]"
							>
								{$t('profileBtn')}</a
							>
							<a
								href="/"
								class="block px-4 py-2 dark:text-gray-300 text-gray-600 hover:text-white hover:bg-gray-300 dark:hover:bg-[#2d3748]"
								on:click={(e) => handleLogOut(e)}
							>
								{$t('profileLogoutBtn')}
							</a>
							<form
								class="hidden"
								bind:this={logOutForm}
								method="POST"
								action="/logout"
								use:enhance
							></form>
						</svelte:fragment>
					</Dropdown>
				</span>
			</div>
		</div>
	</div>
</header>
