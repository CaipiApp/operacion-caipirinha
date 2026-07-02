<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ArrowRight, Star, Wallet, TrendingUp } from 'lucide-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let lang: string;
	export let initialContent: any = null;

	let content: any = initialContent?.hero ?? null;
	let rate: number | null = null;
	let statsInView = false;
	let animatedStats: number[] = [];
	let loadedLang = content ? 'ES' : '';
	let isPt = false;
	let isEn = false;
	let mercosurTitle = '';
	let statusActive = '';
	let statusSoon = '';
	let marketLabel = '';

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('es-AR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(num);
	};

	const parseStat = (val: string) => {
		const match = val.match(/^([^\d\.]*)(\d+\.?\d*)(.*)$/);
		if (!match) return { prefix: '', number: 0, suffix: val, decimals: 0 };
		const prefix = match[1] || '';
		const numStr = match[2] || '0';
		const suffix = match[3] || '';
		const number = Number.parseFloat(numStr);
		const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
		return { prefix, number, suffix, decimals };
	};

	async function fetchRate(retries = 3) {
		try {
			const res = await fetch('/api/proxy-cotizacion', { cache: 'no-store' });
			if (!res.ok) throw new Error(`Status ${res.status}`);
			const data = await res.json();
			if (data && typeof data.cotizacion === 'number') {
				rate = data.cotizacion;
			}
		} catch (err) {
			console.error('Error fetching hero rate:', err);
			if (retries > 0) {
				setTimeout(() => fetchRate(retries - 1), 3000);
			}
		}
	}

	function loadContent() {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => (content = data.hero))
			.catch((err) => console.error('Error loading hero content', err));
	}

	$: if (browser && lang && loadedLang !== lang) {
		loadedLang = lang;
		loadContent();
	}

	let interval: any;
	onMount(() => {
		fetchRate();
		interval = setInterval(fetchRate, 20000);
		// Dispara el conteo animado del hero por si content.stats ya estaba
		// disponible al montar (por ejemplo si se pasó initialContent por SSR).
		// Si content.stats todavía no llegó, el bloque reactivo de más abajo
		// se encarga de disparar la animación en cuanto llegue.
		startStatsAnimation();
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	function scrollToPersonal() {
		const el = document.getElementById('personal');
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function scrollToEmpresas() {
		const el = document.getElementById('empresas');
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function startStatsAnimation() {
		// El bloque reactivo que dispara esto también corre en SSR (a
		// diferencia de onMount), y requestAnimationFrame no existe en Node.
		if (!browser || !content?.stats || statsInView) return;

		statsInView = true;
		animatedStats = content.stats.map(() => 0);

		content.stats.forEach((stat: { value: string }, index: number) => {
			const { number } = parseStat(stat.value);
			if (!number) return;

			let startTime: number | null = null;
			const duration = 2000;

			const animate = (timestamp: number) => {
				if (!startTime) startTime = timestamp;
				const progress = Math.min((timestamp - startTime) / duration, 1);
				const easedProgress = progress * (2 - progress);

				animatedStats[index] = easedProgress * number;
				animatedStats = [...animatedStats];

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					animatedStats[index] = number;
					animatedStats = [...animatedStats];
				}
			};

			requestAnimationFrame(animate);
		});
	}

	const avatars = [
		'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64&h=64&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=64&h=64&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&h=64&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&h=64&auto=format&fit=crop'
	];

	$: isPt = lang === 'PT';
	$: isEn = lang === 'EN';
	$: mercosurTitle = isPt ? 'Rede Mercosul' : isEn ? 'Mercosur Network' : 'Red Mercosur';
	$: statusActive = isPt ? 'Ativo' : isEn ? 'Active' : 'Activo';
	$: statusSoon = isPt ? 'Em breve' : isEn ? 'Coming Soon' : 'Próximamente';
	$: marketLabel =
		content?.marketLabel && content.marketLabel !== 'undefined' ? content.marketLabel : '';

	$: if (content?.stats && animatedStats.length !== content.stats.length) {
		animatedStats = content.stats.map(() => 0);
		statsInView = false;
		// content.stats puede llegar después del mount (se carga async vía
		// loadContent()/fetch a /api/content). Si el onMount ya intentó
		// animar antes de que estos datos existieran, hay que disparar la
		// animación acá; de lo contrario los contadores quedan clavados en 0.
		startStatsAnimation();
	}

</script>

{#if content}
	<section class="relative pt-24 md:pt-32 pb-24 md:pb-32 px-4 sm:px-6 overflow-hidden">
		<!-- Decorative background elements -->
		<div
			class="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"
		></div>
		<div
			class="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"
		></div>

		<div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
			<div class="flex-1 text-center lg:text-left">
				<div
					transition:fade
					class="inline-flex items-center gap-2 bg-brand-primary/10 backdrop-blur-xl border border-brand-primary/25 hover:border-brand-primary/40 px-4 py-1.5 rounded-full mb-8 transition-all"
				>
					<span class="flex h-1.5 w-1.5 relative shrink-0">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"
						></span>
						<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-primary"></span>
					</span>
					<span class="text-xs font-bold tracking-wide text-brand-primary">{content.tag}</span>
				</div>

				<h1
					transition:fly={{ y: 20, duration: 800, delay: 100 }}
					class="text-[clamp(2.25rem,10vw,4.5rem)] sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-8 tracking-tighter group/title text-white"
				>
					{content.title.line1} <br />
					<span class="inline-block relative">
						<span
							class="absolute -inset-2 bg-brand-primary/10 blur-2xl opacity-40 group-hover/title:opacity-100 group-hover/title:scale-110 transition-all duration-700"
						></span>
						<span
							class="landing-gradient-text italic drop-shadow-[0_0_20px_rgba(197,230,68,0.3)] relative z-10 pr-[0.08em]"
						>
							{content.title.line2}
						</span>
					</span>
					<br />
					<span
						class="text-[0.8em] font-extrabold text-white/90 drop-shadow-none select-none tracking-tight block mt-1"
					>
						{content.title.line3}
					</span>
				</h1>

				<p
					transition:fly={{ y: 20, duration: 800, delay: 200 }}
					class="text-lg md:text-xl text-brand-muted mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed"
				>
					{content.description}
				</p>

				<div
					transition:fly={{ y: 20, duration: 800, delay: 300 }}
					class="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 justify-center lg:justify-start flex-wrap"
				>
					<button
						on:click={scrollToPersonal}
						class="w-full sm:w-auto bg-brand-primary text-black px-10 py-4 rounded-full font-black text-lg hover:bg-white transition-all shadow-2xl shadow-brand-primary/30 active:scale-95 group flex items-center justify-center gap-3 focus:outline-none"
					>
						{content.ctaMain}
						<ArrowRight
							size={22}
							strokeWidth={3}
							class="group-hover:translate-x-2 transition-transform"
						/>
					</button>

					<button
						on:click={scrollToEmpresas}
						class="w-full sm:w-auto border border-white/20 hover:border-white/40 text-white/85 hover:text-white bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 backdrop-blur-md focus:outline-none"
					>
						{content.ctaSecondary}
					</button>

					<div class="flex items-center gap-4 px-6 py-3.5 rounded-full landing-glass-dark border border-white/10 shrink-0">
						<div class="flex -space-x-2.5">
							{#each avatars as url, i (url)}
								<div
									class="w-8 h-8 rounded-full border-2 border-brand-dark bg-brand-gray overflow-hidden"
								>
									<img src={url} alt="user avatar" class="w-full h-full object-cover" />
								</div>
							{/each}
						</div>
						<div class="text-left ml-1">
							<p
								class="text-[9px] font-black uppercase tracking-[0.15em] text-brand-primary leading-tight"
							>
								{content.activeUsersLabel}
							</p>
							<p class="text-xs font-bold leading-tight">{content.activeUsers}</p>
						</div>
					</div>
				</div>

				<div
					transition:fade={{ delay: 500 }}
					class="mt-12 flex flex-wrap items-center gap-6 sm:gap-8 justify-center lg:justify-start text-brand-muted"
				>
					{#each content.stats as stat, i (`${stat.label}-${i}`)}
						{@const parsed = parseStat(stat.value)}
						<div class="flex items-center gap-6 sm:gap-8 group">
							<div class="flex flex-col transform transition-all duration-300">
								<span class="text-2xl sm:text-3xl font-black text-white font-display tracking-tight leading-none mb-1.5 min-w-[70px] flex items-center gap-1.5">
									{parsed.prefix}{statsInView
										? animatedStats[i]?.toLocaleString(undefined, {
												minimumFractionDigits: parsed.decimals,
												maximumFractionDigits: parsed.decimals
											})
										: '0'}{parsed.suffix}
									{#if i === 2}
										<Star
											class="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-brand-primary text-brand-primary shrink-0 drop-shadow-[0_0_12px_rgba(197,230,68,0.55)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 ml-0.5"
										/>
									{/if}
								</span>
								<span class="text-[10px] font-bold text-brand-muted uppercase opacity-70 group-hover:text-brand-primary group-hover:opacity-100 transition-all duration-300">
									{stat.label}
								</span>
							</div>
							{#if i < content.stats.length - 1}
								<div class="w-px h-8 bg-white/10 transition-colors duration-300 group-hover:bg-brand-primary/20"></div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div
				transition:fly={{ y: 30, duration: 1000 }}
				class="flex-1 relative w-full h-full lg:h-[700px] flex items-center justify-center"
			>
				<!-- Main Mockup Container -->
				<div
					class="relative w-full max-w-[320px] xs:max-w-[360px] md:max-w-[400px] mx-auto h-[580px] xs:h-[630px] md:h-[720px] shrink-0"
				>
					<!-- Background Glow -->
					<div
						class="absolute -inset-10 bg-brand-primary/10 blur-[100px] rounded-full opacity-50 pointer-events-none"
					></div>

					<div
						class="relative h-full landing-glass rounded-[32px] md:rounded-[48px] p-1.5 md:p-2 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
					>
						<div
							class="h-full bg-brand-dark rounded-[26px] md:rounded-[40px] overflow-hidden relative flex flex-col"
						>
							<!-- Header Section -->
							<div class="p-4 xs:p-5 md:p-6 pb-2 md:pb-3 flex flex-col">
								<div class="flex justify-between items-start mb-4 md:mb-6">
									<div class="min-w-0 flex-1 pr-4">
										<span
											class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-1 md:mb-2 block"
											>Caipi Wallet ®</span
										>
										<h3
											class="text-xl xs:text-2xl sm:text-3xl md:text-[32px] font-black tracking-tighter flex flex-wrap items-center gap-1.5 md:gap-2"
										>
											$1.240.500,00
											<span
												class="flex items-center gap-1 bg-white/5 border border-white/10 px-1.5 md:px-2 py-0.5 rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.2)] shrink-0"
											>
											<img
												src="https://flagcdn.com/w40/ar.png"
												alt="ARS"
												class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full object-cover border border-white/30 brightness-110"
												referrerpolicy="no-referrer"
											/>
												<span class="text-[9px] md:text-[10px] font-black text-white/90">ARS</span>
											</span>
										</h3>
									</div>
									<div
										class="w-9 h-9 md:w-11 md:h-11 rounded-xl landing-glass-dark border border-white/10 flex items-center justify-center shadow-inner shrink-0 leading-none"
									>
										<Wallet size={16} class="text-brand-primary md:w-5 md:h-5" />
									</div>
								</div>

								<div class="grid grid-cols-2 gap-2 md:gap-3">
									<div
										class="landing-glass-dark p-2.5 xs:p-3 md:p-3.5 rounded-xl md:rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default"
									>
										<p
											class="text-[8px] md:text-[9px] text-brand-muted uppercase tracking-wider mb-1 font-bold"
										>
											Último Pago
										</p>
										<p class="font-black text-xs xs:text-sm md:text-base text-brand-primary tracking-tight">
											R$ 450,00
										</p>
										<div class="mt-1.5 md:mt-2 flex items-center gap-1.5 opacity-60">
											<div
												class="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse"
											></div>
											<span class="text-[8px] md:text-[9px] font-bold uppercase whitespace-nowrap"
												>Confirmado</span
											>
										</div>
									</div>
									<div
										class="landing-glass-dark p-2.5 xs:p-3 md:p-3.5 rounded-xl md:rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default"
									>
										<p
											class="text-[8px] md:text-[9px] text-brand-muted uppercase tracking-wider mb-1 font-bold"
										>
											Tipo Real
										</p>
										<a
											href="https://api.caipi.app/cotizacion"
											target="_blank"
											rel="noreferrer"
											class="font-black text-xs xs:text-sm md:text-base tracking-tight text-white flex items-center gap-1 hover:text-brand-primary transition-colors"
										>
											{rate ? formatNumber(rate) : formatNumber(184.2)}
											<span
												class="flex items-center gap-1 bg-white/5 border border-white/10 px-1 py-0.5 rounded shadow-[0_0_10px_rgba(59,130,246,0.2)] shrink-0"
											>
											<img
												src="https://flagcdn.com/w40/ar.png"
												alt="ARS"
												class="w-2 h-2 rounded-full object-cover border border-white/30 brightness-110"
												referrerpolicy="no-referrer"
											/>
												<span class="text-[7.5px] md:text-[8px] font-black text-white/90">ARS</span>
											</span>
										</a>
										<div class="mt-1.5 md:mt-2 flex items-center gap-1.5 text-emerald-400">
											<TrendingUp size={9} strokeWidth={3} class="md:w-[10px] md:h-[10px]" />
											<span class="text-[7.5px] md:text-[8.5px] font-black uppercase px-1 py-0.5 bg-emerald-500/10 border border-emerald-400/20 rounded tracking-wider shrink-0 animate-pulse">Live</span>
											{#if marketLabel}
												<span class="text-[8px] md:text-[9px] font-bold uppercase whitespace-nowrap"
													>{marketLabel}</span
												>
											{/if}
										</div>
									</div>
								</div>

								<div class="mt-2.5 md:mt-3 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-2.5 md:p-3 pb-2 transition-colors hover:border-white/10 group/mercosur shadow-inner">
									<div class="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
										<div class="flex items-center gap-1.5">
											<span class="relative flex h-1.5 w-1.5">
												<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
												<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-primary"></span>
											</span>
											<span class="text-[8.5px] md:text-[9.5px] font-black uppercase tracking-[0.16em] text-brand-primary">{mercosurTitle}</span>
										</div>
										<span class="text-[7.5px] md:text-[8px] text-brand-muted uppercase font-bold tracking-wider opacity-60">Status</span>
									</div>

									<div class="flex flex-col gap-1 md:gap-1.5">
										<div class="flex items-center justify-between py-0.5 md:py-1 px-1 hover:bg-white/[0.01] rounded-lg transition-colors">
											<div class="flex items-center gap-2">
												<img src="https://flagcdn.com/w40/ar.png" class="w-3.5 h-3.5 rounded-full object-cover border border-white/10" referrerpolicy="no-referrer" alt="Argentina" />
												<span class="text-[10px] md:text-xs font-bold text-white/95">Argentina</span>
											</div>
											<div class="flex items-center gap-1.5">
												<span class="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 animate-pulse"></span>
												<span class="text-[8.5px] md:text-[10px] font-bold text-brand-primary uppercase tracking-wide leading-none">{statusActive}</span>
											</div>
										</div>

										<div class="flex items-center justify-between py-0.5 md:py-1 px-1 hover:bg-white/[0.01] rounded-lg transition-colors">
											<div class="flex items-center gap-2">
												<img src="https://flagcdn.com/w40/br.png" class="w-3.5 h-3.5 rounded-full object-cover border border-white/10" referrerpolicy="no-referrer" alt="Brasil" />
												<span class="text-[10px] md:text-xs font-bold text-white/95">Brasil</span>
											</div>
											<div class="flex items-center gap-1.5">
												<span class="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 animate-pulse"></span>
												<span class="text-[8.5px] md:text-[10px] font-bold text-brand-primary uppercase tracking-wide leading-none">{statusActive}</span>
											</div>
										</div>

										<div class="flex items-center justify-between py-0.5 md:py-1 px-1 hover:bg-white/[0.01] rounded-lg transition-colors opacity-50 hover:opacity-90 duration-300">
											<div class="flex items-center gap-2">
												<img src="https://flagcdn.com/w40/py.png" class="w-3.5 h-3.5 rounded-full object-cover border border-white/10 grayscale" referrerpolicy="no-referrer" alt="Paraguay" />
												<span class="text-[10px] md:text-xs font-medium text-white/80">Paraguay</span>
											</div>
											<div class="flex items-center gap-1.5">
												<span class="w-1.5 h-1.5 rounded-full bg-emerald-400/55 shrink-0"></span>
												<span class="text-[8.5px] md:text-[10px] font-medium text-emerald-400 uppercase tracking-wide leading-none">{statusSoon}</span>
											</div>
										</div>

										<div class="flex items-center justify-between py-0.5 md:py-1 px-1 hover:bg-white/[0.01] rounded-lg transition-colors opacity-50 hover:opacity-90 duration-300">
											<div class="flex items-center gap-2">
												<img src="https://flagcdn.com/w40/uy.png" class="w-3.5 h-3.5 rounded-full object-cover border border-white/10 grayscale" referrerpolicy="no-referrer" alt="Uruguay" />
												<span class="text-[10px] md:text-xs font-medium text-white/80">Uruguay</span>
											</div>
											<div class="flex items-center gap-1.5">
												<span class="w-1.5 h-1.5 rounded-full bg-emerald-400/55 shrink-0"></span>
												<span class="text-[8.5px] md:text-[10px] font-medium text-emerald-400 uppercase tracking-wide leading-none">{statusSoon}</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<!-- Transactions Section -->
							<div
								class="flex-1 px-4 xs:px-5 md:px-6 pt-3 md:pt-4 pb-3 md:pb-4 bg-gradient-to-b from-transparent to-brand-dark/50 flex flex-col min-h-0"
							>
								<div class="flex items-center justify-between mb-2.5 md:mb-4 shrink-0">
									<p
										class="text-[8.5px] md:text-[9.5px] text-brand-muted uppercase tracking-[0.2em] font-black"
									>
										{content.mockup.recentActivityLabel}
									</p>
									<button
										class="text-[8.5px] md:text-[9.5px] font-bold text-brand-primary uppercase hover:underline focus:outline-none"
										>{content.mockup.viewAll}</button
									>
								</div>

								<div class="space-y-1.5 md:space-y-2.5 overflow-hidden flex-1 flex flex-col justify-around">
									{#each [{ name: 'Joao Ferreira', amount: 'R$ 125,00', time: `${content.mockup.today}, 10:45 AM`, sub: 'Supermercado BH', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&h=64&auto=format&fit=crop' }, { name: 'Maria Rossi', amount: 'R$ 250,20', time: `${content.mockup.today}, 09:12 AM`, sub: 'Uber Rio', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=64&h=64&auto=format&fit=crop' }, { name: 'Caipi App', amount: 'R$ 375,00', time: `${content.mockup.yesterday}, 11:30 PM`, sub: content.mockup.recharge, avatar: '/caipi_logo_icon.png' }] as item (`${item.name}-${item.time}`)}
										<div
											class="flex items-center justify-between p-2 md:p-3 rounded-xl md:rounded-2xl landing-glass-dark border border-white/5 hover:border-brand-primary/20 hover:bg-white/5 transition-all group/item"
										>
											<div class="flex items-center gap-2.5 md:gap-3.5 min-w-0">
												<div
													class="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-brand-gray/50 border border-white/10 flex items-center justify-center text-brand-primary font-black text-xs overflow-hidden shrink-0"
												>
													<img
														src={item.avatar}
														alt={item.name}
														class="w-full h-full object-cover {item.name === 'Caipi App'
															? 'p-1 xs:p-1.5 md:p-2 opacity-80'
															: ''}"
													/>
												</div>
												<div class="min-w-0">
													<p
													class="text-[11px] md:text-sm font-black group-hover:text-brand-primary transition-colors truncate"
													>
														{item.name}
													</p>
													<p
													class="text-[8.5px] md:text-[9.5px] text-brand-muted font-bold uppercase tracking-wide truncate"
													>
														{item.sub}
													</p>
												</div>
											</div>
											<div class="text-right shrink-0 pl-2">
												<p class="text-[11px] md:text-sm font-black text-white">{item.amount}</p>
												<p class="text-[7.5px] md:text-[8.5px] text-brand-muted font-medium italic">
													{item.time}
												</p>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Nav Bar Simulation -->
							<div
								class="px-6 py-2.5 md:py-3.5 border-t border-white/5 flex justify-around items-center opacity-30 mt-auto shrink-0"
							>
								{#each [1, 2, 3, 4] as i (i)}
									<div class="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white"></div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Floating Savings Card -->
					<div
						class="absolute -right-2 sm:-right-6 md:-right-10 lg:-right-14 top-[72%] xs:top-[74%] sm:top-[76%] z-30 transform-gpu animate-bounce"
						style="animation-duration: 4s;"
					>
						<div
							class="bg-brand-primary/80 sm:bg-brand-primary/40 backdrop-blur-3xl p-1 sm:p-3 md:p-4 rounded-[10px] sm:rounded-2xl md:rounded-[24px] text-white shadow-[0_20px_40px_-10px_rgba(197,230,68,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-white/40 backdrop-saturate-150 transition-all duration-500 hover:bg-brand-primary/55 hover:scale-105 group relative overflow-hidden scale-[0.8] xs:scale-90 sm:scale-100 origin-right"
						>
							<!-- Subtle shine effect -->
							<div
								class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"
							></div>

							<div class="flex items-center gap-1 sm:gap-3 relative z-10">
								<div
									class="bg-black/90 text-brand-primary w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)] group-hover:bg-black group-hover:rotate-6 transition-all duration-500 shrink-0"
								>
									<TrendingUp
										size={16}
										strokeWidth={3}
										class="w-2.5 h-2.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5"
									/>
								</div>
								<div class="min-w-0 pr-1">
									<p
										class="text-[5px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-80 leading-tight mb-0.5 text-white truncate"
									>
										{content.mockup.saveLabel}
									</p>
									<p
										class="text-[9px] sm:text-sm md:text-base font-black leading-none tracking-tighter italic text-white whitespace-nowrap"
									>
										{content.mockup.saveDesc}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}
