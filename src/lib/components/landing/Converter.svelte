<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { ArrowLeftRight, RefreshCw, Smartphone, Globe, Lock } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.converter ?? null;
	let ars = 100000;
	let brl = 0;
	let isArsToBrl = true;
	let rate = 184.5;
	let isUpdating = false;
	let inputValue = '100.000,00';
	let isFocused = false;

	$: if (browser) {
		fetch(`/api/content?lang=${lang}`)
			.then((res) => res.json())
			.then((data) => (content = data.converter))
			.catch((err) => console.error('Error loading converter content', err));
	}

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('es-AR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(num);
	};

	const parseFormattedNumber = (str: string): number => {
		const cleanStr = str.replace(/\./g, '').replace(',', '.');
		return parseFloat(cleanStr) || 0;
	};

	async function fetchRate(retries = 2) {
		try {
			isUpdating = true;
			const res = await fetch('/api/proxy-cotizacion', { cache: 'no-store' });
			if (!res.ok) throw new Error(`Status ${res.status}`);
			const data = await res.json();
			if (data && typeof data.cotizacion === 'number' && data.cotizacion > 0) {
				rate = data.cotizacion;
			}
		} catch (err) {
			console.error('Error fetching exchange rate:', err);
			if (retries > 0) {
				setTimeout(() => fetchRate(retries - 1), 2000);
			}
		} finally {
			setTimeout(() => (isUpdating = false), 500);
		}
	}

	let interval: any;
	onMount(() => {
		fetchRate();
		interval = setInterval(() => fetchRate(0), 20000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function handleInputChange(val: string) {
		const sanitized = val.replace(/[^0-9,]/g, '');
		const parts = sanitized.split(',');
		const limited = parts[0] + (parts.length > 1 ? ',' + parts[1].slice(0, 2) : '');
		inputValue = limited;
		const num = parseFormattedNumber(limited);
		if (isArsToBrl) {
			ars = num;
		} else {
			brl = num;
		}
	}

	function handleFocus() {
		isFocused = true;
	}

	function handleBlur() {
		isFocused = false;
		inputValue = formatNumber(isArsToBrl ? ars : brl);
	}

	function toggleMode() {
		isArsToBrl = !isArsToBrl;
	}

	$: {
		if (isArsToBrl) {
			brl = Number((ars / rate).toFixed(2));
		} else {
			ars = Number((brl * rate).toFixed(2));
		}
	}

	$: if (!isFocused) {
		inputValue = formatNumber(isArsToBrl ? ars : brl);
	}
</script>

{#if content}
	<section class="py-16 md:py-24 px-4 sm:px-6 bg-brand-gray relative overflow-hidden">
		<div class="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-0" />
		<div class="absolute top-0 left-1/2 w-px h-full bg-white/5 -z-0" />

		<div
			class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10"
		>
			<div>
				<h2
					class="text-[clamp(1.75rem,7vw,3.5rem)] sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 italic leading-tight"
				>
					{content.title} <br />
					<span class="text-brand-primary">{content.titleSpan}</span>
					{#if content.titleEnd}
						<br class="hidden sm:block" /> {content.titleEnd}
					{/if}
				</h2>
				<p class="text-brand-muted text-base md:text-lg mb-8 max-w-md">
					{content.description}
				</p>

				<div class="space-y-6">
					{#each content.features as f, i}
						<div class="flex items-start gap-4">
							<div class="w-10 h-10 rounded-full glass flex items-center justify-center shrink-0">
								{#if i === 0}
									<Globe size={18} class="text-brand-primary" />
								{:else}
									<Smartphone size={18} class="text-brand-primary" />
								{/if}
							</div>
							<div>
								<h4 class="font-bold">{f.title}</h4>
								<p class="text-sm text-brand-muted">{f.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div
				transition:fly={{ x: 20, duration: 800 }}
				class="landing-glass p-6 sm:p-8 rounded-[32px] border-brand-primary/20 relative group"
			>
				<!-- Frozen rate badge overlay -->
				<div
					class="absolute -top-3 -right-3 bg-brand-primary text-black px-3 py-1.5 rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-tighter shadow-xl z-20 flex items-center gap-2 animate-bounce"
				>
					<Lock size={12} />
					{content.frozenRateBadge}
				</div>

				<div
					class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10"
				>
					<h3 class="text-xl font-bold">{content.calculatorTitle}</h3>
					<a
						href="https://wa.me/5493794182462"
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-2 text-[10px] sm:text-xs text-white/80 font-medium hover:text-brand-primary transition-all group/api cursor-pointer bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-primary/30"
					>
						<span
							class="w-2 h-2 rounded-full transition-colors duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] {isUpdating
								? 'bg-white scale-125'
								: 'bg-emerald-500'}"
						></span>
						{content.liveRateLabel}: 1 BRL = {formatNumber(rate)} ARS
						<div class="flex items-center gap-1 text-brand-primary ml-1">
							<RefreshCw
								size={10}
								class="group-hover/api:rotate-180 transition-transform duration-500 {isUpdating
									? 'animate-spin'
									: ''}"
							/>
						</div>
					</a>
				</div>

				<div class="space-y-4">
					<div class="relative">
						<label
							class="text-[10px] uppercase font-bold text-brand-muted mb-2 block tracking-widest"
							for="input-conv"
						>
							{content.sendLabel} ({isArsToBrl ? 'ARS' : 'BRL'})
						</label>
						<div
							class="bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 focus-within:border-brand-primary/50 transition-colors flex items-center justify-between"
						>
							<input
								id="input-conv"
								type="text"
								inputmode="decimal"
								value={inputValue}
								on:input={(e) => handleInputChange(e.currentTarget.value)}
								on:focus={handleFocus}
								on:blur={handleBlur}
								class="bg-transparent text-2xl sm:text-3xl font-bold outline-none w-full min-w-0"
							/>
							<div
								class="flex items-center gap-2 font-bold px-2 py-1 sm:px-3 bg-white/10 rounded-lg text-xs sm:text-sm shrink-0 uppercase"
							>
								{#if isArsToBrl}
									<div class="flex items-center gap-2">
										<img loading="lazy"
											src="https://flagcdn.com/w40/ar.png"
											class="w-4 h-4 rounded-full object-cover border border-white/20"
											referrerpolicy="no-referrer"
											alt="AR"
										/>
										<span>ARS</span>
									</div>
								{:else}
									<div class="flex items-center gap-2">
										<img loading="lazy"
											src="https://flagcdn.com/w40/br.png"
											class="w-4 h-4 rounded-full object-cover border border-white/20"
											referrerpolicy="no-referrer"
											alt="BR"
										/>
										<span>BRL</span>
									</div>
								{/if}
							</div>
						</div>
					</div>

					<div class="flex justify-center -my-4 relative z-10">
						<button
							on:click={toggleMode}
							class="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-black hover:rotate-180 transition-all duration-500 active:scale-90 focus:outline-none"
						>
							<ArrowLeftRight size={20} />
						</button>
					</div>

					<div class="relative">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label
							class="text-[10px] uppercase font-bold text-brand-muted mb-2 block tracking-widest"
						>
							{content.receiveLabel} ({isArsToBrl ? 'BRL' : 'ARS'})
						</label>
						<div
							class="bg-white/10 p-4 sm:p-6 rounded-2xl border border-white/5 flex items-center justify-between"
						>
							<div
								class="text-2xl sm:text-3xl font-bold text-brand-primary truncate mr-4 tabular-nums"
							>
								{formatNumber(isArsToBrl ? brl : ars)}
							</div>
							<div
								class="flex items-center gap-2 font-bold px-2 py-1 sm:px-3 bg-white/10 rounded-lg text-xs sm:text-sm shrink-0 uppercase"
							>
								{#if isArsToBrl}
									<div class="flex items-center gap-2">
										<img loading="lazy"
											src="https://flagcdn.com/w40/br.png"
											class="w-4 h-4 rounded-full object-cover border border-white/20"
											referrerpolicy="no-referrer"
											alt="BR"
										/>
										<span>BRL</span>
									</div>
								{:else}
									<div class="flex items-center gap-2">
										<img loading="lazy"
											src="https://flagcdn.com/w40/ar.png"
											class="w-4 h-4 rounded-full object-cover border border-white/20"
											referrerpolicy="no-referrer"
											alt="AR"
										/>
										<span>ARS</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="mt-10 pt-8 border-t border-white/10 space-y-4">
					<div
						class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/5 gap-3"
					>
						<span
							class="flex items-center gap-3 font-black text-brand-muted uppercase tracking-widest text-[9px] sm:text-[10px]"
						>
							<Globe size={14} class="text-brand-primary" />
							{content.netReceiptLabel}
						</span>
						<span
							class="text-2xl sm:text-3xl font-black text-brand-primary tabular-nums flex items-center gap-2"
						>
							{formatNumber(isArsToBrl ? brl : ars)}
							<span
								class="text-xs sm:text-sm font-bold text-brand-muted inline-flex items-center gap-1.5 ml-1"
							>
								{#if isArsToBrl}
									<img loading="lazy"
										src="https://flagcdn.com/w40/br.png"
										class="w-4 h-4 rounded-full object-cover border border-white/20"
										referrerpolicy="no-referrer"
										alt="BR"
									/>
									<span>BRL</span>
								{:else}
									<img loading="lazy"
										src="https://flagcdn.com/w40/ar.png"
										class="w-4 h-4 rounded-full object-cover border border-white/20"
										referrerpolicy="no-referrer"
										alt="AR"
									/>
									<span>ARS</span>
								{/if}
							</span>
						</span>
					</div>

					<div
						class="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-start gap-4"
					>
						<div
							class="w-10 h-10 rounded-xl bg-brand-primary text-black flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/20"
						>
							<Lock size={20} />
						</div>
						<div>
							<p class="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-0.5">
								{content.guaranteedRateTitle}
							</p>
							<p class="text-xs text-brand-muted leading-tight font-medium">
								{content.guaranteedRate.replace('{rate}', formatNumber(rate))}
								{content.appFunctionNote}
							</p>
							{#if content.rateDisclaimer}
								<p class="text-[9.5px] text-brand-muted/75 mt-2 leading-relaxed border-t border-brand-primary/10 pt-1.5 font-normal">
									{content.rateDisclaimer}
								</p>
							{/if}
						</div>
					</div>

					<button
						class="w-full bg-white text-black py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-brand-primary transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] group focus:outline-none"
					>
						<RefreshCw size={18} class="group-hover:rotate-180 transition-transform duration-700" />
						{content.cta}
					</button>
				</div>
			</div>
		</div>
	</section>
{/if}
