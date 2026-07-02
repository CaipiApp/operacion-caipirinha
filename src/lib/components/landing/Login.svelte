<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import {
		Mail,
		Lock,
		AlertCircle,
		Loader2,
		Eye,
		EyeOff,
		ArrowRight,
		ArrowLeft
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TermsModal from '$lib/components/landing/TermsModal.svelte';
	import { browser } from '$app/environment';

	export let params: any = {};
	export let lang = 'ES';

	let email = '';
	let password = '';
	let showPassword = false;
	let isLoading = false;
	let error = '';
	let showTerms = false;
	let content: any = null;

	$: if (browser) {
		const apiUrl = `/api/content?lang=${lang}`;
		fetch(apiUrl)
			.then((res) => res.json())
			.then((data) => (content = data.login))
			.catch((err) => console.error('Error loading login content', err));
	}

	function handleSubmit() {
		isLoading = true;
		error = '';

		setTimeout(() => {
			if (email && password) {
				goto('/');
			} else {
				isLoading = false;
				error = content.errorFields;
			}
		}, 1500);
	}
</script>

{#if content}
	<div
		class="min-h-screen bg-brand-dark relative overflow-x-hidden font-sans selection:bg-brand-primary selection:text-black flex flex-col"
	>
		<div class="fixed inset-0 z-0 pointer-events-none">
			<div
				class="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-brand-primary/10 blur-[140px] rounded-full animate-pulse"
			></div>
			<div
				class="absolute bottom-[-10%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/5 blur-[140px] rounded-full animate-pulse"
				style="animation-delay: 3s;"
			></div>
			<div
				class="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-brand-secondary/5 blur-[120px] rounded-full"
			></div>
		</div>

		<div class="fixed top-0 left-0 right-0 z-50 p-5 md:p-10 pointer-events-none">
			<button
				transition:scale={{ duration: 300, start: 0.9 }}
				on:click={() => goto('/')}
				class="pointer-events-auto flex items-center gap-3 text-white font-black text-[10px] sm:text-[11px] tracking-[0.25em] py-3.5 px-6 sm:px-8 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 backdrop-blur-2xl transition-all active:scale-95 shadow-2xl hover:border-brand-primary/40 group focus:outline-none"
				style="margin-top: env(safe-area-inset-top);"
			>
				<ArrowLeft
					size={16}
					strokeWidth={3}
					class="group-hover:-translate-x-1 transition-transform"
				/>
				<span>{content.backBtn}</span>
			</button>
		</div>

		<div
			class="relative z-10 w-full flex-1 flex flex-col items-center px-4 py-8 md:py-12 lg:py-20 overflow-y-auto overflow-x-hidden min-h-screen"
		>
			<div class="h-16 md:hidden"></div>

			<div transition:fly={{ y: -20, duration: 800 }} class="mb-10 sm:mb-16 lg:mb-20">
				<img loading="lazy"
					src="/caipi_logo_full.png"
					alt="Caipi"
					class="h-12 sm:h-16 md:h-20 w-auto object-contain cursor-pointer drop-shadow-[0_0_25px_rgba(197,230,68,0.25)]"
					on:click={() => goto('/')}
					referrerpolicy="no-referrer"
				/>
			</div>

			<div
				transition:fly={{ y: 40, duration: 800 }}
				class="w-full max-w-[500px] lg:max-w-[540px] landing-glass rounded-[32px] sm:rounded-[48px] md:rounded-[56px] p-8 sm:p-14 lg:p-20 shadow-[0_80px_120px_-30px_rgba(0,0,0,0.85)] relative overflow-hidden"
			>
				<img loading="lazy"
					src="/caipi_logo_icon.png"
					class="absolute -bottom-16 -right-16 w-64 md:w-80 opacity-[0.04] pointer-events-none rotate-12"
					alt=""
					referrerpolicy="no-referrer"
				/>

				<div
					class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent shadow-[0_0_20px_rgba(197,230,68,0.4)]"
				></div>

				<div class="mb-12 md:mb-16 relative">
					<div
						transition:fly={{ x: -10, delay: 200 }}
						class="inline-block bg-brand-primary/10 border border-brand-primary/20 px-3.5 py-1.5 rounded-full mb-6"
					>
						<span class="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary"
							>{content.badge}</span
						>
					</div>
					<h1
						class="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 tracking-tighter leading-[0.9] skew-x-[-2deg] italic uppercase"
					>
						{content.title} <br />
						<span class="landing-gradient-text drop-shadow-[0_0_15px_rgba(197,230,68,0.3)]"
							>{content.titleSpan}</span
						>
					</h1>
					<div
						class="h-1.5 w-16 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(197,230,68,0.3)]"
					></div>
				</div>

				<form on:submit|preventDefault={handleSubmit} class="space-y-8 md:space-y-10 relative">
					<div class="space-y-3 group">
						<label
							class="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-focus-within:text-brand-primary transition-colors ml-1"
							for="email"
						>
							{content.emailLabel}
						</label>
						<div class="relative">
							<div
								class="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-all"
							>
								<Mail size={18} strokeWidth={2.5} />
							</div>
							<input
								id="email"
								type="email"
								required
								bind:value={email}
								placeholder="empresa@caipi.app"
								class="w-full bg-transparent border-b-2 border-white/10 py-5 pl-10 pr-6 text-white font-bold text-base sm:text-lg focus:outline-none focus:border-brand-primary focus:bg-white/[0.03] transition-all placeholder:text-white/20"
							/>
						</div>
					</div>

					<div class="space-y-3 group">
						<div class="flex justify-between items-center px-1">
							<label
								class="block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-focus-within:text-brand-primary transition-colors"
								for="password"
							>
								{content.passwordLabel}
							</label>
							<button
								type="button"
								class="text-[10px] font-black uppercase tracking-widest text-brand-primary/50 hover:text-brand-primary transition-colors focus:outline-none"
							>
								{content.forgotPassword}
							</button>
						</div>
						<div class="relative">
							<div
								class="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-primary transition-all"
							>
								<Lock size={18} strokeWidth={2.5} />
							</div>
							{#if showPassword}
								<input
									id="password-text"
									type="text"
									required
									bind:value={password}
									placeholder="••••••••"
									class="w-full bg-transparent border-b-2 border-white/10 py-5 pl-10 pr-12 text-white font-bold text-base sm:text-lg focus:outline-none focus:border-brand-primary focus:bg-white/[0.03] transition-all placeholder:text-white/20"
								/>
							{:else}
								<input
									id="password-pass"
									type="password"
									required
									bind:value={password}
									placeholder="••••••••"
									class="w-full bg-transparent border-b-2 border-white/10 py-5 pl-10 pr-12 text-white font-bold text-base sm:text-lg focus:outline-none focus:border-brand-primary focus:bg-white/[0.03] transition-all placeholder:text-white/20"
								/>
							{/if}
							<button
								type="button"
								on:click={() => (showPassword = !showPassword)}
								class="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-2 -mr-2 focus:outline-none"
							>
								{#if showPassword}
									<EyeOff size={18} />
								{:else}
									<Eye size={18} />
								{/if}
							</button>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="group w-full bg-brand-primary text-black font-black uppercase tracking-[0.3em] text-[12px] sm:text-sm py-5.5 sm:py-6 rounded-[20px] sm:rounded-[24px] shadow-2xl shadow-brand-primary/25 hover:bg-white transition-all flex items-center justify-center gap-4 active:scale-[0.98] mt-12 sm:mt-16 border-2 border-transparent disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden focus:outline-none"
					>
						{#if isLoading}
							<div class="flex items-center gap-4">
								<Loader2 size={24} class="animate-spin" />
								<span>{content.loadingBtn}</span>
							</div>
						{:else}
							<div class="flex items-center gap-4">
								<span>{content.submitBtn}</span>
								<ArrowRight
									size={20}
									class="group-hover:translate-x-2 transition-all"
									strokeWidth={3}
								/>
							</div>
						{/if}
					</button>
				</form>

				{#if error}
					<div
						transition:fly={{ y: 10 }}
						class="mt-10 p-5 bg-red-500/10 border-l-[6px] border-red-500 rounded-2xl flex items-center gap-4"
					>
						<AlertCircle class="text-red-500 shrink-0" size={24} />
						<p
							class="text-[11px] sm:text-[12px] text-red-200 font-black uppercase tracking-wider leading-snug"
						>
							{error}
						</p>
					</div>
				{/if}

				<div class="mt-16 pt-12 border-t border-white/10 flex flex-col items-center relative">
					<span class="text-[11px] text-white/20 font-black uppercase tracking-[0.25em] mb-6"
						>{content.noAccount}</span
					>
					<button
						type="button"
						on:click={() => goto('/')}
						class="text-white font-display font-black text-2xl sm:text-3xl lg:text-4xl hover:text-brand-primary transition-all decoration-brand-primary decoration-[6px] sm:decoration-[8px] underline underline-offset-[8px] sm:underline-offset-[10px] active:scale-95 mb-10 focus:outline-none"
					>
						{content.registerBtn}
					</button>
					<button
						type="button"
						on:click={() => (showTerms = true)}
						class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-brand-primary transition-colors py-4 px-8 border border-white/5 hover:border-brand-primary/20 rounded-full backdrop-blur-sm focus:outline-none"
					>
						{content.termsLabel}
					</button>
				</div>
			</div>

			<div
				transition:fade={{ delay: 700 }}
				class="mt-20 sm:mt-24 lg:mt-32 flex flex-col items-center gap-10 opacity-30 group pb-12"
			>
				<div class="flex items-center gap-6 sm:gap-10">
					<div
						class="h-px w-8 sm:w-16 bg-white/30 group-hover:w-20 transition-all duration-700"
					></div>
					<p
						class="text-center text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] sm:tracking-[0.7em] whitespace-nowrap"
					>
						{content.metadata}
					</p>
					<div
						class="h-px w-8 sm:w-16 bg-white/30 group-hover:w-20 transition-all duration-700"
					></div>
				</div>
				<div
					class="flex items-center gap-4 text-[9px] font-bold text-white/50 tracking-widest uppercase flex-wrap justify-center"
				>
					<span>CAIPI FINTECH</span>
					<div class="w-1 h-1 rounded-full bg-brand-primary hidden sm:block"></div>
					<span>2024 REGULATED</span>
					<div class="w-1 h-1 rounded-full bg-brand-primary hidden sm:block"></div>
					<button
						type="button"
						on:click={() => (showTerms = true)}
						class="hover:text-brand-primary transition-colors cursor-pointer focus:outline-none uppercase"
					>
						{content.termsLabel}
					</button>
				</div>
			</div>
		</div>
		<TermsModal isOpen={showTerms} onClose={() => (showTerms = false)} {lang} />
	</div>
{/if}
