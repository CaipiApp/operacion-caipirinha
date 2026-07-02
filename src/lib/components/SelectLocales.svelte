<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { supportedLocales } from '$lib/translate/i18n';
	import Dropdown from './Dropdown.svelte';
	let sending = false;
	async function setLocale(key: string) {
		sending = true;
		const form = new FormData();
		form.set('locale', key);
		await fetch('/?/setLocale', { method: 'post', body: form });
		await invalidateAll();
		sending = false;
	}
	function translate(key: string) {
		if (key === 'pt') return 'br';
		if (key === 'es') return 'arg';
		return key;
	}
</script>

<div class="bg-black rounded-full px-4 py-2">
	<Dropdown class="!bg-zinc-700">
		<div slot="button" class="inline-flex items-center gap-2">
			<img src="/images/landing/{$page.data.locale}.png" alt="flag.png" class="w-4 h-4" />
			<span class="uppercase">
				{translate($page.data.locale)}
			</span>
		</div>
		<svelte:fragment slot="links">
			{#each supportedLocales as key}
				{#if key != $page.data.locale}
					<button
						class="flex gap-2 items-center w-full py-1 hover:bg-zinc-400 uppercase text-left px-4 bg-zinc-700 !text-white"
						on:click={() => setLocale(key)}
						disabled={sending}
					>
						<img src="/images/landing/{key}.png" alt="flag.png" class="w-2 h-2" />
						{translate(key)}
					</button>
				{/if}
			{/each}
		</svelte:fragment>
	</Dropdown>
</div>
