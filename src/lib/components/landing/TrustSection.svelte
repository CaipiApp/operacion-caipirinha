<script lang="ts">
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { Lock, Building2 } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.trust ?? null;
	let loadedLang = content ? 'ES' : '';
	let companiesInView = false;
	let animatedCompanies = 0;
	let companiesObserver: IntersectionObserver | null = null;

	function loadContent() {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error ${res.status}`);
				return res.json();
			})
			.then((data) => {
				content = data.trust;
				companiesInView = false;
				animatedCompanies = 0;
			})
			.catch((err) => console.error('Error loading trust section', err));
	}

	$: if (browser && lang && loadedLang !== lang) {
		loadedLang = lang;
		loadContent();
	}

	onDestroy(() => {
		companiesObserver?.disconnect();
		companiesObserver = null;
	});

	function startCompaniesAnimation() {
		if (companiesInView) return;

		companiesInView = true;
		animatedCompanies = 0;

		let startTime: number | null = null;
		const target = 70;
		const duration = 2000;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const easedProgress = progress * (2 - progress);

			animatedCompanies = easedProgress * target;

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				animatedCompanies = target;
			}
		};

		requestAnimationFrame(animate);
	}

	function observeCompaniesMetric(node: HTMLDivElement) {
		if (!browser || companiesInView) return;

		companiesObserver = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					startCompaniesAnimation();
					companiesObserver?.disconnect();
					companiesObserver = null;
				}
			},
			{ threshold: 0.2, rootMargin: '-10px' }
		);

		companiesObserver.observe(node);

		return {
			destroy() {
				companiesObserver?.disconnect();
				companiesObserver = null;
			}
		};
	}
</script>

{#if content}
	<section id="confianza" class="py-24 border-y border-white/5 bg-white/[0.01] relative overflow-hidden select-none">
		<div class="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-[350px] h-[350px] bg-brand-primary/[0.03] blur-[120px] rounded-full pointer-events-none"></div>
		<div class="absolute top-1/2 right-0 -translate-y-1/2 -z-10 w-[350px] h-[350px] bg-emerald-500/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

		<div class="max-w-7xl mx-auto px-6">
			<div class="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">
				<div class="max-w-xl lg:max-w-sm xl:max-w-md text-center lg:text-left shrink-0">
					<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-5 shadow-inner">
						<span class="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse"></span>
						{lang === 'EN' ? 'TRUSTED ECOSYSTEM' : lang === 'PT' ? 'ECOSSISTEMA' : 'RED DE CONFIANZA'}
					</span>

					<h2 class="text-2xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-black tracking-tight mb-4 text-white font-display leading-[1.1] md:leading-tight">
						{content.title}
					</h2>

					<p class="text-sm md:text-[15px] text-brand-muted leading-relaxed font-normal opacity-90">
						{content.description}
					</p>

					<div use:observeCompaniesMetric class="mt-8 pt-6 border-t border-white/5 flex items-center justify-center lg:justify-start gap-6 sm:gap-8">
						<div class="flex flex-col items-center">
							<p class="text-2xl sm:text-3xl font-black text-brand-primary font-display leading-none tracking-tight flex items-center gap-1 sm:gap-1.5 justify-center tabular-nums">
								<span class="inline-block min-w-[3.2ch] text-right">
									+{Math.round(animatedCompanies)}
								</span>
								<Building2 class="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px] text-brand-primary fill-brand-primary/10 drop-shadow-[0_0_10px_rgba(197,230,68,0.45)] shrink-0 ml-0.5 hover:scale-110 transition-transform duration-300" />
							</p>
							<p class="text-center text-[8px] sm:text-[9.5px] text-brand-muted uppercase tracking-wider font-extrabold mt-1 sm:mt-1.5">
								{lang === 'EN' ? 'COMPANIES' : 'EMPRESAS'}
							</p>
						</div>
						<div class="w-px h-8 bg-white/10"></div>
						<div class="flex flex-col items-center">
							<p class="text-2xl sm:text-3xl font-black text-white font-display leading-none tracking-tight flex items-center gap-1 sm:gap-1.5 justify-center tabular-nums">
								<span class="inline-block min-w-[4ch] text-right">100%</span>
								<Lock class="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px] text-emerald-400 fill-emerald-400/10 drop-shadow-[0_0_10px_rgba(52,211,153,0.45)] shrink-0 ml-0.5 animate-pulse" />
							</p>
							<p class="text-center text-[8px] sm:text-[9.5px] text-brand-muted uppercase tracking-wider font-extrabold mt-1 sm:mt-1.5">
								{lang === 'EN' ? 'SECURE FLOW' : lang === 'PT' ? 'SEGURO' : 'SEGURO Y LEGAL'}
							</p>
						</div>
					</div>
				</div>

				<div class="flex-1 w-full">
					<div class="grid grid-cols-1 min-[380px]:grid-cols-2 md:grid-cols-3 gap-x-4 min-[380px]:gap-x-6 sm:gap-x-8 gap-y-6 md:gap-y-12 items-center place-items-center">
						{#each content.companies as company, i (`${company.name}-${i}`)}
							<div transition:fade={{ delay: i * 80 }} class="flex flex-col items-center group relative w-full h-full max-w-[280px]">
								<div class="w-full h-24 min-[380px]:h-28 sm:h-32 rounded-[20px] md:rounded-[32px] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-3xl border border-white/15 flex items-center justify-center p-4 sm:p-7 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-white/[0.07] group-hover:to-brand-primary/[0.02] group-hover:border-brand-primary/30 group-hover:shadow-[0_12px_40px_-15px_rgba(197,230,68,0.15)] overflow-hidden">
									{#if company.logo}
										<div class="relative w-full h-full flex items-center justify-center">
											<img loading="lazy"
												src="/{company.logo}"
												alt={company.name}
												
												class="max-h-[85%] max-w-[85%] object-contain grayscale brightness-200 contrast-125 opacity-55 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:opacity-100 transition-all duration-500 pointer-events-none drop-shadow-2xl"
												on:error={(e) => {
													const target = e.currentTarget;
													target.classList.add('hidden');
													const fallback = target.nextElementSibling;
													if (fallback) fallback.classList.remove('hidden');
												}}
											/>
											<div class="hidden absolute inset-0 flex items-center justify-center p-2">
												<span class="text-[10px] min-[380px]:text-[11px] font-black italic tracking-tighter text-white/50 uppercase text-center leading-tight group-hover:text-white/90 transition-colors duration-500 break-words w-full">
													{company.name}
												</span>
											</div>
										</div>
									{:else}
										<div class="w-full h-full flex items-center justify-center p-2">
											<span class="text-[10px] min-[380px]:text-xs sm:text-lg font-black italic tracking-tighter text-white/50 uppercase text-center group-hover:text-white/90 transition-colors duration-500 break-words w-full leading-tight">
												{company.name}
											</span>
										</div>
									{/if}
								</div>

								<div class="absolute -bottom-5 flex flex-col items-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none">
									<span class="text-[9px] sm:text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
										{company.name}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}
