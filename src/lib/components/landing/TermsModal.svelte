<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { TERMS_TEXT_ES, TERMS_TEXT_PT, TERMS_TEXT_EN } from '$lib/components/landing/constants';

	export let isOpen = false;
	export let onClose: () => void;
	export let lang = 'ES';

	let content: any = null;

	$: if (isOpen) {
		fetch(`/api/content?lang=${lang}`)
			.then((res) => res.json())
			.then((data) => (content = data.registration))
			.catch((err) => console.error('Error loading terms content', err));
	}

	function getTermsText() {
		switch (lang.toUpperCase()) {
			case 'PT':
				return TERMS_TEXT_PT;
			case 'EN':
				return TERMS_TEXT_EN;
			default:
				return TERMS_TEXT_ES;
		}
	}

	$: currentTerms = getTermsText();
</script>

{#if isOpen && content}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" transition:fade>
		<div
			on:click={onClose}
			on:keydown={(e) => e.key === 'Escape' && onClose()}
			class="absolute inset-0 bg-brand-dark/90 backdrop-blur-2xl"
		></div>
		<div
			transition:scale={{ duration: 300, start: 0.9 }}
			class="relative w-full max-w-[800px] max-h-[80vh] landing-glass rounded-[32px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
		>
			<!-- Modal Header -->
			<div
				class="p-8 sm:p-10 border-b border-white/10 flex items-center justify-between bg-white/[0.02]"
			>
				<div>
					<h2
						class="text-xl sm:text-2xl font-display font-black text-white tracking-tight uppercase italic skew-x-[-2deg]"
					>
						{content.termsTitle} <span class="text-brand-primary">&</span>
						{content.termsSpan}
					</h2>
					<p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">
						{content.legalsLabel}
					</p>
				</div>
				<button
					on:click={onClose}
					class="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all active:scale-90 hover:border-brand-primary/40 group focus:outline-none"
				>
					<X size={20} class="group-hover:rotate-90 transition-transform duration-300" />
				</button>
			</div>

			<!-- Modal Body -->
			<div class="flex-1 overflow-y-auto p-8 sm:p-12 landing-custom-scrollbar">
				<div class="prose prose-invert max-w-none">
					<div
						class="text-white/60 text-sm sm:text-base leading-relaxed space-y-6 font-medium tracking-tight whitespace-pre-wrap"
					>
						{#each currentTerms.split('\n') as paragraph}
							{#if !paragraph.trim()}
								<br />
							{:else}
								<p>{paragraph}</p>
							{/if}
						{/each}
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="p-8 sm:p-10 border-t border-white/10 flex justify-center bg-white/[0.02]">
				<button
					on:click={onClose}
					class="bg-brand-primary text-black font-black uppercase tracking-[0.3em] text-[11px] py-4 px-10 rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all active:scale-95 focus:outline-none"
				>
					{content.understandBtn}
				</button>
			</div>
		</div>
	</div>
{/if}
