<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ArrowRight, Menu, X, Globe, ChevronDown } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let onOpenRegistration: () => void;
	export let currentLang = 'ES';
	export let onLangChange: (lang: string) => void;
	export let initialContent: any = null;

	let content: any = initialContent?.navbar ?? null;
	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isLangOpen = false;

	const languages = [
		{ code: 'ES', name: 'Español' },
		{ code: 'PT', name: 'Português' },
		{ code: 'EN', name: 'English' }
	];

	$: if (browser) {
		const apiUrl = `/api/content?lang=${currentLang}`;
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => (content = data.navbar))
			.catch((err) => console.error('Error loading navbar', err));
	}

	function handleScroll() {
		isScrolled = window.scrollY > 20;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function changeLang(code: string) {
		onLangChange(code);
		isLangOpen = false;
		isMobileMenuOpen = false;
	}
</script>

{#if content}
	<nav
		transition:fade
		class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 md:py-4 transition-all duration-300 {isScrolled
			? 'bg-black/90 backdrop-blur-md border-b border-white/10'
			: 'bg-transparent'}"
	>
		<div class="max-w-7xl mx-auto w-full flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="flex items-center">
					<a
						href="/"
						class="relative h-12 flex items-center group cursor-pointer"
						on:click|preventDefault={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					>
						<img
							src="/caipi_logo_full.png"
							alt="Caipi Logo"
							class="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
							referrerpolicy="no-referrer"
						/>
					</a>
				</div>
			</div>

			<div class="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
				{#each content.links as link}
					<a href={link.href} class="hover:text-white transition-colors min-h-[44px] flex items-center">
						{link.name}
					</a>
				{/each}
			</div>

			<div class="flex items-center gap-2">
				<!-- Language Selector Desktop -->
				<div class="relative hidden lg:block mr-2">
					<button
						on:click={() => (isLangOpen = !isLangOpen)}
						class="flex items-center gap-2 hover:bg-white/5 px-3 py-2 min-h-[44px] rounded-xl transition-all text-xs font-black uppercase tracking-widest text-brand-muted hover:text-white"
					>
						<Globe size={14} class="text-brand-primary" />
						<span>{currentLang}</span>
						<ChevronDown
							size={14}
							class="transition-transform duration-300 {isLangOpen ? 'rotate-180' : ''}"
						/>
					</button>

					{#if isLangOpen}
						<div
							transition:fly={{ y: 10, duration: 200 }}
							class="absolute top-full right-0 mt-2 w-32 landing-glass border border-white/10 rounded-2xl overflow-hidden py-1 z-50"
						>
							{#each languages as lang}
								<button
									on:click={() => changeLang(lang.code)}
									class="w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between {currentLang ===
									lang.code
										? 'text-brand-primary bg-brand-primary/10'
										: 'text-brand-muted hover:text-white hover:bg-white/5'}"
								>
									{lang.name}
									{#if currentLang === lang.code}
										<div class="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
									{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<button
					on:click={() => goto('/login')}
					class="hidden lg:flex items-center text-sm font-black uppercase tracking-widest hover:text-brand-primary transition-colors px-4 py-2 min-h-[44px] focus:outline-none"
				>
					{content.login}
				</button>
				<button
					on:click={onOpenRegistration}
					class="bg-brand-primary text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2 sm:gap-3 hover:bg-white transition-all active:scale-95 shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 group border border-brand-primary/20 focus:outline-none"
				>
					<span>{content.cta}</span>
					<ArrowRight
						size={16}
						class="group-hover:translate-x-1 flex-shrink-0 transition-transform"
					/>
				</button>

				<!-- Mobile Menu Toggle -->
				<button
					on:click={toggleMobileMenu}
					class="md:hidden p-2 text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 ml-2 focus:outline-none"
				>
					{#if isMobileMenuOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>
			</div>
		</div>
	</nav>

	<!-- Mobile Menu Overlay -->
	{#if isMobileMenuOpen}
		<div
			transition:fly={{ x: '100%', duration: 400 }}
			class="fixed inset-0 z-[60] bg-black p-8 flex flex-col md:hidden"
		>
			<div class="flex justify-between items-center mb-12">
				<a
					href="/"
					on:click|preventDefault={() => {
						isMobileMenuOpen = false;
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}}
				>
					<img src="/caipi_logo_full.png" class="h-8" alt="Logo" referrerpolicy="no-referrer" />
				</a>
				<button on:click={() => (isMobileMenuOpen = false)} class="p-2 focus:outline-none"
					><X size={32} /></button
				>
			</div>

			<div class="flex flex-col gap-6 sm:gap-8">
				{#each content.links as link, i}
					<a
						class="text-3xl sm:text-4xl font-bold hover:text-brand-primary transition-colors"
						href={link.href}
						on:click={() => (isMobileMenuOpen = false)}
					>
						{link.name}
					</a>
				{/each}

				<!-- Mobile Language Selector -->
				<div class="mt-2 pt-6 border-t border-white/10">
					<p class="text-[9px] uppercase tracking-widest text-brand-muted font-black mb-3">
						{content.languageLabel}
					</p>
					<div class="flex flex-wrap gap-3">
						{#each languages as lang}
							<button
								on:click={() => changeLang(lang.code)}
								class="flex-1 min-w-[80px] px-4 py-3 rounded-xl text-xs font-bold border transition-all {currentLang ===
								lang.code
									? 'border-brand-primary text-brand-primary bg-brand-primary/10'
									: 'border-white/10 text-brand-muted'}"
							>
								{lang.name}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-auto space-y-3 pt-6">
				<button
					on:click={() => {
						isMobileMenuOpen = false;
						goto('/login');
					}}
					class="w-full bg-white/10 text-white py-4 rounded-xl font-bold text-sm min-h-[48px] focus:bg-white/20"
				>
					{content.login}
				</button>
				<button
					on:click={() => {
						isMobileMenuOpen = false;
						onOpenRegistration();
					}}
					class="w-full bg-brand-primary text-black py-4 rounded-xl font-bold text-sm min-h-[48px] focus:bg-brand-primary/90"
				>
					{content.cta}
				</button>
			</div>
		</div>
	{/if}
{/if}
