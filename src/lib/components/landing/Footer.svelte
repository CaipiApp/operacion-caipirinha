<script lang="ts">
	import TermsModal from '$lib/components/landing/TermsModal.svelte';
	import { browser } from '$app/environment';

	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.footer ?? null;
	let showTerms = false;
	let showLogoFallback = false;

	$: if (browser) {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => (content = data.footer))
			.catch((err) => console.error('Error loading footer', err));
	}
</script>

{#if content}
	<footer class="bg-brand-dark border-t border-white/5 pt-16 md:pt-20 pb-8 md:pb-10 px-4 sm:px-6">
		<div class="max-w-7xl mx-auto">
			<div
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-16 md:mb-20 px-2 sm:px-0"
			>
				<div class="col-span-1 lg:col-span-1">
					<div class="flex items-center mb-6 shrink-0">
						<div class="relative h-8 flex items-center gap-2 group">
							{#if !showLogoFallback}
								<img loading="lazy"
									src="/caipi_logo_full.png"
									alt="Caipi Logo"
									class="h-8 object-contain"
									referrerpolicy="no-referrer"
									on:error={() => (showLogoFallback = true)}
								/>
							{:else}
								<div class="flex items-center gap-2">
									<div
										class="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center rotate-12"
									>
										<span class="text-black font-bold text-lg -rotate-12">C</span>
									</div>
									<span class="font-display text-2xl font-bold tracking-tight">caipi</span>
								</div>
							{/if}
						</div>
					</div>
					<p class="text-brand-muted text-sm leading-relaxed mb-8">
						{content.tagline}
					</p>
					<div class="flex gap-3">
						{#each content.socials as social (social.name)}
							<a
								href={social.url}
								target="_blank"
								rel="noreferrer"
								aria-label={social.name}
								class="w-11 h-11 rounded-xl landing-glass flex items-center justify-center hover:bg-brand-primary hover:text-black hover:border-brand-primary transition-all duration-300"
							>
								{#if social.name === 'Twitter'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path
											d="M4 20l6.768 -6.768m2.46 -2.46L20 4"
										/></svg
									>
								{:else if social.name === 'Instagram'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path
											d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
										/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
									>
								{:else if social.name === 'LinkedIn'}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path
											d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
										/><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg
									>
								{/if}
							</a>
						{/each}
					</div>

					{#if content.fintechLabel}
						<div class="mt-8 pt-6 border-t border-white/5">
							<p
								id="footer-fintech-header"
								class="text-[10px] uppercase font-black tracking-widest text-brand-primary mb-2.5"
							>
								{lang.toUpperCase() === 'ES'
									? 'CONFIANZA'
									: lang.toUpperCase() === 'PT'
										? 'CONFIANÇA'
										: 'TRUST'}
							</p>
							<div class="flex flex-col gap-2">
								<a
									href="https://camarafintech.org/miembros/"
									target="_blank"
									rel="noopener noreferrer"
									class="bg-white hover:bg-white/95 px-3 py-2 rounded-xl flex items-center justify-center border border-white/10 hover:border-brand-primary transition-all duration-300 w-fit group/fintech shadow-md"
								>
									<img loading="lazy"
										src="/camara_fintech.svg"
										alt="Camara Argentina de Fintech"
										
										class="h-8 object-contain group-hover/fintech:scale-[1.02] transition-transform duration-300"
										referrerpolicy="no-referrer"
									/>
								</a>
								<p class="text-[11px] text-brand-muted mt-1 leading-tight font-medium">
									{content.fintechLabel}
								</p>
							</div>
						</div>
					{/if}
				</div>

				<div>
					<h4 class="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
						{content.productTitle}
					</h4>
					<ul class="text-brand-muted text-sm font-bold">
						<li><a href="/caipi-app" class="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Caipi App</a></li>
						<li>
							<a href="/caipi-empresas" class="hover:text-white transition-colors min-h-[44px] inline-flex items-center">Caipi Empresas</a>
						</li>
						<li>
							<a
								href="https://wa.me/5493794182462"
								target="_blank"
								rel="noreferrer"
								class="hover:text-white transition-colors min-h-[44px] inline-flex items-center">{content.apiLabel}</a
							>
						</li>
						<li><a href="/" class="hover:text-white transition-colors min-h-[44px] inline-flex items-center">{content.costsLabel}</a></li>
					</ul>
				</div>

				<div>
					<h4 class="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
						{content.legalTitle}
					</h4>
					<ul class="text-brand-muted text-sm font-bold">
						<li>
							<button
								on:click={() => (showTerms = true)}
								class="hover:text-white transition-colors cursor-pointer text-left focus:outline-none min-h-[44px] inline-flex items-center"
							>
								{content.termsLabel}
							</button>
						</li>
					</ul>
				</div>
			</div>

			<div
				class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8"
			>
				<p class="text-brand-muted text-[9px] font-black uppercase tracking-[0.3em]">
					{content.copyright}
				</p>
				<div class="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-brand-muted">
					{#each content.countries as country (country)}
						<a href="/" class="hover:text-brand-primary transition-colors min-h-[44px] inline-flex items-center">{country}</a>
					{/each}
				</div>
			</div>
		</div>
		<TermsModal isOpen={showTerms} onClose={() => (showTerms = false)} {lang} />
	</footer>
{/if}
