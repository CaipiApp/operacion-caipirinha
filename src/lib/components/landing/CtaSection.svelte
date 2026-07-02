<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ArrowRight, Building2, Store, Briefcase, ShoppingBag } from 'lucide-svelte';
	import { browser } from '$app/environment';

	export let onOpenRegistration: () => void;
	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.ctaSection ?? null;
	let loadedLang = content ? 'ES' : '';

	function loadContent() {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error ${res.status}`);
				return res.json();
			})
			.then((data) => (content = data.ctaSection))
			.catch((err) => console.error('Error loading CTA', err));
	}

	$: if (browser && lang && loadedLang !== lang) {
		loadedLang = lang;
		loadContent();
	}

	const ctaIcons = [
		{ icon: Building2, color: 'bg-blue-500/20 text-blue-400' },
		{ icon: Store, color: 'bg-brand-primary/20 text-brand-primary' },
		{ icon: Briefcase, color: 'bg-purple-500/20 text-purple-400' },
		{ icon: ShoppingBag, color: 'bg-orange-500/20 text-orange-400' }
	];
</script>

{#if content}
	<section class="py-12 md:py-24 px-4 sm:px-6" transition:fly={{ y: 30, duration: 700 }}>
		<div
			class="max-w-5xl mx-auto landing-glass p-6 sm:p-12 md:p-20 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] text-center relative overflow-hidden group"
			transition:fade={{ duration: 500 }}
		>
				<div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/5 to-transparent -z-10"></div>

				<img loading="lazy"
					src="/caipi_logo_icon.png"
					class="absolute -bottom-10 -right-10 w-48 sm:w-64 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-700"
					alt=""
					referrerpolicy="no-referrer"
				/>

				<div class="flex justify-center mb-6 sm:mb-8">
					<div class="flex -space-x-3 sm:-space-x-4">
						{#each ctaIcons as item (item.icon)}
							<div
								class={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-white/10 ${item.color} backdrop-blur-md flex items-center justify-center shadow-lg transform transition-transform hover:-translate-y-1 hover:scale-110`}
							>
								<svelte:component this={item.icon} size={18} />
							</div>
						{/each}
						<div
							class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-brand-primary bg-brand-primary flex flex-col items-center justify-center text-black font-black shadow-[0_0_20px_rgba(197,230,68,0.3)]"
						>
							<span class="text-[8px] sm:text-[10px] leading-none mb-0.5"
								>{content.moreThanLabel}</span
							>
							<span class="text-xs sm:text-sm leading-none">{content.countLabel}</span>
						</div>
					</div>
				</div>

			<h2 class="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight px-2">
				{content.title}<br class="hidden sm:block" />
				<span class="landing-gradient-text italic inline-block tracking-normal pr-[0.16em]"
					>{content.titleSpan}</span
				>
			</h2>
			<p class="text-brand-muted text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl mx-auto px-4">
				{content.desc}
			</p>

				<div class="flex items-center justify-center px-4 sm:px-0">
					<button
						on:click={onOpenRegistration}
						class="w-full sm:w-auto bg-white text-black px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-brand-primary transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-white/10 group/btn focus:outline-none"
					>
						{content.button}
						<ArrowRight size={20} class="group-hover/btn:translate-x-1 transition-transform" />
					</button>
				</div>

			<div class="absolute -top-20 -left-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl animate-pulse"></div>
		</div>
	</section>
{/if}
