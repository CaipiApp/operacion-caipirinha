<script lang="ts">
	import { fade } from 'svelte/transition';
	import {
		Zap,
		TrendingUp,
		Smartphone,
		CheckCircle2,
		Lock,
		Briefcase,
		ArrowRight
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let onOpenRegistration: () => void;
	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.features ?? null;
	let activeStore: 'apple' | 'google' | null = null;

	const ICON_MAP: { [key: string]: any } = {
		Zap: Zap,
		TrendingUp: TrendingUp,
		Smartphone: Smartphone,
		CheckCircle2: CheckCircle2,
		Lock: Lock
	};

	const ICON_COLORS: { [key: string]: string } = {
		Zap: 'text-brand-primary',
		TrendingUp: 'text-emerald-400',
		Smartphone: 'text-blue-400',
		CheckCircle2: 'text-purple-400',
		Lock: 'text-purple-400'
	};

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod|macintosh/.test(ua)) {
			activeStore = 'apple';
		} else if (/android/.test(ua)) {
			activeStore = 'google';
		}
	});

	$: if (browser) {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => (content = data.features))
			.catch((err) => console.error('Error loading features', err));
	}
</script>

{#if content}
	<section id="soluciones" class="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
		<div class="text-center mb-10 md:mb-16 px-4">
			<h2
				class="text-[clamp(1.75rem,8vw,3.5rem)] sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-tight"
			>
				{content.title.line1} <br />
				<span class="landing-gradient-text italic">{content.title.line2}</span>
			</h2>
			<p class="text-brand-muted max-w-2xl mx-auto text-base md:text-lg">
				{content.description}
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
			<!-- Business Solution -->
			<div
				id="empresas"
				transition:fade
				class="landing-glass p-6 sm:p-8 md:p-12 rounded-[32px] md:rounded-[48px] border-white/10 relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-500 scroll-mt-24"
			>
				<div
					class="absolute -top-12 -right-12 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity"
				>
					<Briefcase size={240} />
				</div>

				<div
					class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-[0_0_20px_-10px_rgba(197,230,68,0.3)]"
				>
					<div
						class="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(197,230,68,1)]"
					/>
					{content.business.tag}
				</div>

				<h3 class="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 tracking-tight">
					{content.business.title.split(' ')[0]}
					<span class="landing-gradient-text italic px-1 font-black"
						>{content.business.title.split(' ')[1]}</span
					>
				</h3>
				<p class="text-brand-muted mb-8 sm:mb-12 max-w-md text-base sm:text-lg leading-relaxed">
					{content.business.description}
				</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-14">
					{#each content.business.items as f}
						<div class="group/item flex sm:block items-center gap-4 sm:gap-0">
							<div
								class={`w-12 h-12 sm:w-14 sm:h-14 ${f.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white/5 sm:mb-4 group-hover/item:scale-110 transition-transform shrink-0`}
							>
								<svelte:component this={ICON_MAP[f.icon]} class={ICON_COLORS[f.icon]} />
							</div>
							<div>
								<h4
									class="font-black text-base sm:text-lg mb-1 sm:mb-2 text-white group-hover/item:text-brand-primary transition-colors"
								>
									{f.title}
								</h4>
								<p class="text-[10px] sm:text-xs text-brand-muted leading-relaxed font-medium">
									{f.description}
								</p>
							</div>
						</div>
					{/each}
				</div>

				<button
					on:click={onOpenRegistration}
					class="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-primary/5 flex items-center justify-center gap-3 focus:outline-none"
				>
					{content.business.cta}
					<ArrowRight size={18} />
				</button>
			</div>

			<!-- Personal Solution -->
			<div
				id="personal"
				transition:fade
				class="landing-glass p-6 sm:p-8 md:p-12 rounded-[32px] md:rounded-[48px] border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 scroll-mt-24"
			>
				<!-- Decorative background -->
				<div
					class="absolute -top-12 -right-12 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity text-blue-400"
				>
					<Smartphone size={240} />
				</div>

				<div
					class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8 shadow-[0_0_20px_-10px_rgba(59,130,246,0.3)]"
				>
					<div
						class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]"
					/>
					{content.personal.tag}
				</div>

				<h3 class="text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 tracking-tight">
					{content.personal.title.split(' ')[0]}
					<span class="text-blue-400 italic px-1 font-black"
						>{content.personal.title.split(' ')[1]}</span
					>
				</h3>
				<p class="text-brand-muted mb-8 sm:mb-12 max-w-md text-base sm:text-lg leading-relaxed">
					{content.personal.description}
				</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 mb-10 sm:mb-14">
					{#each content.personal.items as f}
						<div class="group/item flex sm:block items-center gap-4 sm:gap-0">
							<div
								class={`w-12 h-12 sm:w-14 sm:h-14 ${f.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white/5 sm:mb-4 group-hover/item:scale-110 transition-transform shrink-0`}
							>
								<svelte:component this={ICON_MAP[f.icon]} class={ICON_COLORS[f.icon]} />
							</div>
							<div>
								<h4
									class="font-black text-base sm:text-lg mb-1 sm:mb-2 text-white group-hover/item:text-blue-400 transition-colors"
								>
									{f.title}
								</h4>
								<p class="text-[10px] sm:text-xs text-brand-muted leading-relaxed font-medium">
									{f.description}
								</p>
							</div>
						</div>
					{/each}
				</div>

				<div class="flex flex-col xs:flex-row flex-wrap gap-4">
					<button
						on:click={() =>
							window.open(
								'https://apps.apple.com/ar/app/caipi/id6755209840',
								'_blank',
								'noopener,noreferrer'
							)}
						class="flex items-center gap-3 bg-black border {activeStore === 'apple'
							? 'border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)] scale-[1.03]'
							: 'border-white/20'} px-6 py-2.5 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-all hover:scale-102 active:scale-95 group/store shadow-2xl flex-1 justify-center sm:justify-start relative focus:outline-none"
					>
						{#if activeStore === 'apple'}
							<div
								class="absolute -top-px -left-px -right-px h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
							/>
						{/if}
						<svg
							viewBox="0 0 22.7 24"
							width="20"
							class="fill-white transition-colors group-hover/store:fill-blue-400 {activeStore ===
							'apple'
								? 'fill-blue-400'
								: ''}"
						>
							<path
								d="M18.7 10.3c0-2.8 2.1-4.2 2.2-4.3-1.3-1.9-3.3-2.1-4.2-2.2-2-.2-4 1.2-5 1.2-1 0-2.6-1.1-4.2-1.1-2.1.1-4 1.3-5.1 3.2-2.1 3.6-.5 8.9 1.6 12 1 1.4 2.2 3 3.8 3 1.5 0 2-1 3.8-1s2.4 1 3.9 1c1.6 0 2.7-1.4 3.7-2.9.9-1.3 1.3-2.6 1.3-2.7 0-.1-2.9-1.1-3-4.3z"
							/>
							<path
								d="M15.5 3.3c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.9.9-3.7 1.9-.7.9-1.4 2.4-1.2 3.9 1.4.1 2.8-.7 3.6-1.7z"
							/>
						</svg>
						<div class="text-left">
							<p class="text-[9px] leading-tight opacity-60 font-medium whitespace-nowrap">
								{content.store.appleLabel}
							</p>
							<p class="text-sm font-bold leading-tight -mt-0.5 whitespace-nowrap">
								{content.store.appleStore}
							</p>
						</div>
					</button>
					<button
						on:click={() =>
							window.open(
								'https://play.google.com/store/apps/details?id=caipi.app.com&hl=es',
								'_blank',
								'noopener,noreferrer'
							)}
						class="flex items-center gap-3 bg-black border {activeStore === 'google'
							? 'border-brand-primary shadow-[0_0_25px_rgba(197,230,68,0.3)] scale-[1.03]'
							: 'border-white/20'} px-6 py-2.5 rounded-xl sm:rounded-2xl hover:bg-white/5 transition-all hover:scale-102 active:scale-95 group/store shadow-2xl flex-1 justify-center sm:justify-start relative focus:outline-none"
					>
						{#if activeStore === 'google'}
							<div
								class="absolute -top-px -left-px -right-px h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent rounded-full shadow-[0_0_15px_rgba(197,230,68,0.5)]"
							/>
						{/if}
						<svg
							viewBox="0 0 512 512"
							width="20"
							class="fill-white transition-colors group-hover/store:fill-brand-primary {activeStore ===
							'google'
								? 'fill-brand-primary'
								: ''}"
						>
							<path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
							<path
								d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256.6L47 0z"
							/>
							<path
								d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5 1.2-38.8-1.1-1.1-1.1-1.1-2.4-2z"
							/>
							<path
								d="M384.7 328l-280.8 161.2c-1.1.6-1.1 1.1-1.1 1.1 0 0 2.2 1.1 2.2 1.1l219.6-219.6 60.1 56.2z"
							/>
						</svg>
						<div class="text-left">
							<p class="text-[9px] leading-tight opacity-60 font-medium whitespace-nowrap">
								{content.store.googleLabel}
							</p>
							<p class="text-sm font-bold leading-tight -mt-0.5 whitespace-nowrap">
								{content.store.googleStore}
							</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	</section>
{/if}
