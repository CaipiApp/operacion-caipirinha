<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { ChevronDown, HelpCircle } from 'lucide-svelte';
	import { browser } from '$app/environment';

	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.faq ?? null;
	let openIndex: number | null = null;

	$: if (browser) {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => (content = data.faq))
			.catch((err) => console.error('Error loading FAQ', err));
	}

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

{#if content}
	<section id="faq" class="py-20 md:py-28 px-4 sm:px-6 bg-brand-dark relative overflow-hidden">
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-brand-primary/5 blur-[160px] rounded-full pointer-events-none"></div>

		<div class="max-w-4xl mx-auto relative z-10">
			<div class="text-center mb-14 md:mb-16">
				<div
					transition:fade
					class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest mb-6"
				>
					<HelpCircle size={14} />
					{content.tag}
				</div>
				<h2
					class="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight mb-4 px-4 text-white"
				>
					{content.title}
				</h2>
				<p class="text-white/90 max-w-2xl mx-auto text-base sm:text-lg px-4 leading-relaxed font-normal">
					{content.description}
				</p>
			</div>

			<div class="space-y-3.5 md:space-y-4 px-2 sm:px-0">
				{#each content.items as item, index (`${item.q}-${index}`)}
					<div
						transition:fade={{ delay: index * 100 }}
						class="rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden {openIndex ===
						index
							? 'bg-white/[0.04] border-white/20 shadow-2xl'
							: 'bg-white/[0.01] border-white/10 hover:border-white/20'}"
					>
						<button
							on:click={() => toggle(index)}
							class="w-full px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between text-left group gap-4 focus:outline-none"
						>
							<span
								class="text-[15px] sm:text-base md:text-lg font-bold transition-colors {openIndex ===
								index
									? 'text-brand-primary'
									: 'text-white group-hover:text-brand-primary'}"
							>
								{item.q}
							</span>
							<div
								class="p-1.5 sm:p-2 rounded-full border transition-all shrink-0 {openIndex === index
									? 'border-brand-primary bg-brand-primary text-black rotate-180'
									: 'border-white/10 text-white'}"
							>
								<ChevronDown size={16} />
							</div>
						</button>

						{#if openIndex === index}
							<div transition:slide={{ duration: 300 }}>
								<div
									class="px-5 sm:px-8 pb-4 sm:pb-5 text-[14px] sm:text-[15px] text-brand-muted leading-relaxed font-normal"
								>
									{item.a}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}
