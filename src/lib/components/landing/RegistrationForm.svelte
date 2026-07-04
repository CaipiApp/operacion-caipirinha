<script lang="ts">
	import { fade, scale, fly } from 'svelte/transition';
	import {
		X,
		Upload,
		Download,
		CheckCircle2,
		Loader2,
		FileText,
		Building2,
		Mail,
		Phone,
		Fingerprint,
		Briefcase
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import {
		formatPhone,
		normalizePhone,
		validatePhone,
		formatCUIT,
		normalizeCUIT,
		validateCUIT
	} from '$lib/validation/contactFields';

	export let isOpen = false;
	export let onClose: () => void;
	export let lang: string;

	let step = 1;
	let resources: any[] = [];
	let content: any = null;
	let isSubmitting = false;
	let isSuccess = false;

	let formData = {
		legalRepresentative: '',
		businessName: '',
		email: '',
		phone: '',
		taxId: '',
		businessType: 'Empresa'
	};

	let phoneError = '';
	let taxIdError = '';

	function handlePhoneInput(e: Event) {
		const input = e.target as HTMLInputElement;
		formData.phone = formatPhone(input.value);
		if (phoneError) phoneError = '';
	}

	function handlePhoneBlur() {
		if (formData.phone.trim() === '') {
			phoneError = '';
			return;
		}
		phoneError = validatePhone(formData.phone)
			? ''
			: 'Ingresá un teléfono válido con código de país.';
	}

	function handleTaxIdInput(e: Event) {
		const input = e.target as HTMLInputElement;
		formData.taxId = formatCUIT(input.value);
		if (taxIdError) taxIdError = '';
	}

	function handleTaxIdBlur() {
		if (formData.taxId.trim() === '') {
			taxIdError = '';
			return;
		}
		taxIdError = validateCUIT(formData.taxId) ? '' : 'Ingresá un CUIT válido.';
	}

	let files: { [key: string]: File[] } = {
		doc1: [],
		doc2: [],
		doc3: [],
		doc4: [],
		doc5: [],
		f1: [],
		f2: [],
		f3: [],
		f4: []
	};

	let uploadStates: Record<
		string,
		{ progress: number; status: 'idle' | 'uploading' | 'success' | 'error' }
	> = {};

	$: {
		if (isOpen) {
			const fetchData = async () => {
				try {
					const [resResp, contentResp] = await Promise.all([
						fetch('/api/resources'),
						fetch(`/api/content?lang=${lang}`)
					]);

					if (!resResp.ok || !contentResp.ok) throw new Error('Fetch failed');

					resources = await resResp.json();
					content = (await contentResp.json()).registration;
				} catch (err) {
					console.error('Error loading registration data', err);
				}
			};
			fetchData();
		}
	}

	function simulateUpload(key: string) {
		uploadStates[key] = { progress: 0, status: 'uploading' };
		uploadStates = { ...uploadStates };

		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 30;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				uploadStates[key] = { progress: 100, status: 'success' };
			} else {
				uploadStates[key] = { ...uploadStates[key], progress };
			}
			uploadStates = { ...uploadStates };
		}, 400);
	}

	function handleFileChange(e: Event, key: string) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			let selectedFiles = Array.from(input.files);
			if (key === 'doc5' && selectedFiles.length > 3) {
				selectedFiles = selectedFiles.slice(0, 3);
			}
			files[key] = selectedFiles;
			files = { ...files };
			simulateUpload(key);
		}
	}

	$: isStep1Valid =
		formData.legalRepresentative.trim() !== '' &&
		formData.businessName.trim() !== '' &&
		formData.email.trim() !== '' &&
		formData.phone.trim() !== '' &&
		formData.taxId.trim() !== '' &&
		formData.businessType.trim() !== '' &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
		validatePhone(formData.phone) &&
		validateCUIT(formData.taxId);

	$: isStep3Valid = content
		? content.step3Files?.every(
				(item: any) =>
					files[item.k] && files[item.k].length > 0 && uploadStates[item.k]?.status === 'success'
			)
		: false;

	async function handleSubmit() {
		handlePhoneBlur();
		handleTaxIdBlur();
		if (!isStep1Valid || !isStep3Valid || phoneError || taxIdError) return;
		isSubmitting = true;

		const data = new FormData();
		Object.entries(formData).forEach(([k, v]) => {
			if (k === 'phone') {
				data.append(k, normalizePhone(v));
			} else if (k === 'taxId') {
				data.append(k, normalizeCUIT(v));
			} else {
				data.append(k, String(v));
			}
		});
		Object.entries(files).forEach(([k, fileList]) => {
			fileList.forEach((file) => data.append(k, file));
		});

		// Etiqueta legible de cada campo documental (ej. "doc1" -> "Identidad
		// Apoderados"), para que el backend pueda armar el nombre operativo del
		// archivo sin duplicar el copy de traducciones en el servidor.
		const documentFieldLabels: Record<string, string> = {};
		content.step3Files?.forEach((item: { k: string; l: string }) => {
			documentFieldLabels[item.k] = item.l;
		});
		data.append('documentFieldLabels', JSON.stringify(documentFieldLabels));

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				body: data
			});
			const result = await response.json();
			if (result.success) {
				isSuccess = true;
			}
		} catch (err) {
			console.error('Submission error', err);
		} finally {
			isSubmitting = false;
		}
	}

	function nextStep() {
		if (step < 3) step += 1;
	}

	function prevStep() {
		if (step > 1) step -= 1;
	}
</script>

{#if isOpen && content}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
		<div
			transition:fade
			on:click={onClose}
			class="absolute inset-0 bg-black/80 backdrop-blur-sm"
		></div>

		<div
			transition:scale={{ duration: 300, start: 0.95 }}
			class="relative w-full max-w-5xl md:max-h-[85vh] lg:max-h-[90vh] overflow-hidden landing-glass rounded-t-[32px] md:rounded-[40px] shadow-2xl border-white/20 flex flex-col md:flex-row h-[92vh] md:h-auto"
		>
			<button
				type="button"
				on:click|stopPropagation={onClose}
				aria-label="Cerrar"
				class="absolute top-4 right-4 sm:top-6 sm:right-6 z-[70] w-12 h-12 flex items-center justify-center rounded-full landing-glass hover:bg-white/20 transition-all active:scale-90 group focus:outline-none"
			>
				<X class="text-white group-hover:rotate-90 transition-transform" size={24} />
			</button>

			<!-- Sidebar -->
			<div
				class="w-full md:w-[320px] lg:w-[400px] bg-brand-primary p-6 sm:p-10 md:p-12 lg:p-16 text-black flex flex-col justify-between shrink-0 relative overflow-hidden h-auto md:h-full"
			>
				<div
					class="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -mr-32 -mt-32"
				/>

				<div class="relative z-10">
					<div class="mb-4 sm:mb-8 md:mb-16 group">
						<img loading="lazy"
							src="/caipi_logo_full.png"
							alt="Caipi Logo"
							class="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105 brightness-0"
							referrerpolicy="no-referrer"
						/>
					</div>
					<h2
						class="text-2xl sm:text-4xl md:text-5xl font-black font-display leading-[1.1] md:leading-[0.95] mb-4 md:mb-8 tracking-tighter italic uppercase text-white skew-x-[-2deg]"
					>
						{content.sidebarTitle}
					</h2>
					<p
						class="hidden sm:block text-sm sm:text-base font-bold leading-tight opacity-70 mb-8 md:mb-16 max-w-[280px]"
					>
						{content.sidebarDesc}
					</p>

					<div
						class="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-8 mt-2 md:mt-0 overflow-x-auto landing-no-scrollbar pb-4 md:pb-0"
					>
						{#each content.steps as stepTitle, idx}
							<div class="flex items-center gap-3 sm:gap-5 group cursor-default shrink-0">
								<div
									class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs sm:text-sm font-black border-2 transition-all duration-500 {step >=
									idx + 1
										? 'bg-black text-brand-primary border-black scale-110 shadow-lg'
										: 'border-black/20 text-black/40'}"
								>
									{idx + 1}
								</div>
								<div class="flex flex-col hidden sm:flex">
									<span
										class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 {step ===
										idx + 1
											? 'text-black'
											: 'text-black/40'}"
									>
										{content.stepLabel}
										{idx + 1}
									</span>
									<span
										class="text-xs sm:text-sm font-bold tracking-tight uppercase {step === idx + 1
											? 'text-black'
											: 'text-black/40'}"
									>
										{stepTitle}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="hidden md:flex relative z-10 items-center gap-2">
					<div class="w-2 h-2 rounded-full bg-black/20 animate-pulse" />
					<div class="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 uppercase">
						{content.supportLabel}
					</div>
				</div>
			</div>

			<!-- Form Content -->
			<div
				class="flex-1 p-6 sm:p-10 md:p-12 lg:p-16 overflow-y-auto bg-brand-dark relative landing-custom-scrollbar max-h-full"
			>
				{#if isSuccess}
					<div
						transition:scale
						class="h-full flex flex-col items-center justify-center text-center py-10 sm:py-20"
					>
						<div
							class="w-20 h-20 sm:w-24 sm:h-24 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 sm:mb-8"
						>
							<CheckCircle2 size={40} class="text-brand-primary" />
						</div>
						<h3 class="text-2xl sm:text-3xl font-bold mb-4">{content.successTitle}</h3>
						<p class="text-brand-muted text-sm sm:text-base mb-10 max-w-md">
							{content.successDesc}
						</p>
						<button
							on:click={onClose}
							class="bg-brand-primary text-black px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-brand-primary/10 w-full sm:w-auto focus:outline-none"
						>
							{content.successBtn}
						</button>
					</div>
				{:else}
					<form on:submit|preventDefault={handleSubmit} class="space-y-6 sm:space-y-8">
						{#if step === 1}
							<div transition:fly={{ x: 20 }}>
								<div class="mb-8">
									<div class="flex items-center gap-3 mb-3 md:mb-4">
										<Building2 class="text-brand-primary" size={20} />
										<div class="h-0.5 w-10 md:w-12 bg-brand-primary/20" />
									</div>
									<h3
										class="text-xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3 tracking-tighter text-white"
									>
										{content.step1Title}
									</h3>
									<p
										class="text-brand-muted text-xs sm:text-base font-medium opacity-70 leading-relaxed max-w-lg"
									>
										{content.step1Desc}
									</p>
								</div>

								<div class="grid grid-cols-1 gap-y-6 sm:gap-y-10">
									<div class="space-y-2 group">
										<label
											class="text-[9px] uppercase font-black tracking-[0.2em] text-brand-primary flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity"
											for="legalRep"
										>
											<Fingerprint size={12} />
											{content.fields.legalRepresentative}
										</label>
										<input
											id="legalRep"
											required
											bind:value={formData.legalRepresentative}
											class="w-full bg-white/[0.03] border-b-2 border-white/10 py-3 sm:py-5 px-0 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-sm sm:text-base font-bold placeholder:text-white/20"
										/>
									</div>
									<div class="space-y-2 group">
										<label
											class="text-[9px] uppercase font-black tracking-[0.2em] text-brand-primary flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity"
											for="bizName"
										>
											<Building2 size={12} />
											{content.fields.businessName}
										</label>
										<input
											id="bizName"
											required
											bind:value={formData.businessName}
											class="w-full bg-white/[0.03] border-b-2 border-white/10 py-3 sm:py-5 px-0 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-sm sm:text-base font-bold placeholder:text-white/20"
										/>
									</div>
									<div class="space-y-2 group">
										<label
											class="text-[9px] uppercase font-black tracking-[0.2em] text-brand-primary flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity"
											for="bizType"
										>
											<Briefcase size={12} />
											{content.fields.businessType}
										</label>
										<select
											id="bizType"
											bind:value={formData.businessType}
											class="w-full bg-white/[0.03] border-b-2 border-white/10 py-3 sm:py-5 px-0 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-sm sm:text-base font-bold text-white appearance-none cursor-pointer"
										>
											{#each content.fields.businessTypeOptions as opt}
												<option value={opt} class="bg-brand-dark text-white">{opt}</option>
											{/each}
										</select>
									</div>
									<div class="space-y-2 group">
										<label
											class="text-[9px] uppercase font-black tracking-[0.2em] text-brand-primary flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity"
											for="bizEmail"
										>
											<Mail size={12} />
											{content.fields.email}
										</label>
										<input
											id="bizEmail"
											type="email"
											required
											bind:value={formData.email}
											class="w-full bg-white/[0.03] border-b-2 border-white/10 py-3 sm:py-5 px-0 outline-none focus:border-brand-primary focus:bg-white/[0.05] transition-all text-sm sm:text-base font-bold placeholder:text-white/20"
										/>
									</div>
									<div class="space-y-2 group">
										<label
											class="text-[9px] uppercase font-black tracking-[0.2em] text-brand-primary flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity"
											for="bizPhone"
										>
											<Phone size={12} />
											{content.fields.phone}
										</label>
										<input
											id="bizPhone"
											required
											inputmode="tel"
											autocomplete="tel"
											placeholder="+54 11 1234-5678"
											value={formData.phone}
											on:input={handlePhoneInput}
											on:blur={handlePhoneBlur}
											aria-invalid={!!phoneError}
											aria-describedby="bizPhone-error"
											class="w-full bg-white/[0.03] border-b-2 py-3 sm:py-5 px-0 outline-none focus:bg-white/[0.05] transition-all text-sm sm:text-base font-bold placeholder:text-white/20 {phoneError
												? 'border-red-500'
												: 'border-white/10 focus:border-brand-primary'}"
										/>
										{#if phoneError}
											<p id="bizPhone-error" class="text-[10px] sm:text-xs font-bold text-red-400">
												{phoneError}
											</p>
										{/if}
									</div>
									<div class="space-y-2 group">
										<label
											class="text-[9px] uppercase font-black tracking-[0.2em] text-brand-primary flex items-center gap-2 opacity-80 group-focus-within:opacity-100 transition-opacity"
											for="bizTaxId"
										>
											<Fingerprint size={12} />
											{content.fields.taxId}
										</label>
										<input
											id="bizTaxId"
											required
											inputmode="numeric"
											placeholder="20-12345678-9"
											value={formData.taxId}
											on:input={handleTaxIdInput}
											on:blur={handleTaxIdBlur}
											aria-invalid={!!taxIdError}
											aria-describedby="bizTaxId-error"
											class="w-full bg-white/[0.03] border-b-2 py-3 sm:py-5 px-0 outline-none focus:bg-white/[0.05] transition-all text-sm sm:text-base font-bold placeholder:text-white/20 {taxIdError
												? 'border-red-500'
												: 'border-white/10 focus:border-brand-primary'}"
										/>
										{#if taxIdError}
											<p id="bizTaxId-error" class="text-[10px] sm:text-xs font-bold text-red-400">
												{taxIdError}
											</p>
										{/if}
									</div>
								</div>

								<div class="flex justify-end pt-6 md:pt-12">
									<button
										type="button"
										disabled={!isStep1Valid}
										on:click={nextStep}
										class="w-full sm:w-auto px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg transition-all shadow-[0_20px_40px_rgba(197,230,68,0.2)] active:scale-95 uppercase tracking-tighter {isStep1Valid
											? 'bg-brand-primary text-black hover:bg-white cursor-pointer'
											: 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'}"
									>
										{content.step1Btn}
									</button>
								</div>
							</div>
						{:else if step === 2}
							<div transition:fly={{ x: 20 }}>
								<div class="mb-8">
									<div class="flex items-center gap-3 mb-3 md:mb-4">
										<Download class="text-brand-primary" size={20} />
										<div class="h-0.5 w-10 md:w-12 bg-brand-primary/20" />
									</div>
									<h3
										class="text-xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3 text-white tracking-tighter"
									>
										{content.step2Title}
									</h3>
									<p
										class="text-brand-muted text-xs sm:text-base font-medium opacity-70 leading-relaxed max-w-lg"
									>
										{content.step2Desc}
									</p>
								</div>

								<div class="grid grid-cols-1 gap-4 sm:gap-5">
									{#each resources as res}
										{@const ext = res.url.split('.').pop()?.toLowerCase() ?? ''}
										<a
											href={res.url}
											target="_blank"
											rel="noreferrer"
											download={`${res.name}.${ext}`}
											class="flex items-center justify-between p-5 sm:p-7 bg-white/[0.03] rounded-2xl sm:rounded-3xl border-2 border-white/5 hover:border-brand-primary/30 hover:bg-white/[0.06] transition-all group shadow-sm"
										>
											<div class="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
												<div
													class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shrink-0"
												>
													<FileText size={20} class="sm:w-7 sm:h-7" />
												</div>
												<div class="min-w-0">
													<p
														class="font-black text-sm sm:text-base leading-tight text-white group-hover:text-brand-primary transition-colors truncate"
													>
														{res.name}
													</p>
													<div class="flex items-center gap-2 mt-1 sm:mt-1.5 opacity-40">
														<span
															class="text-[8px] sm:text-[10px] font-black uppercase tracking-wider"
															>{ext}</span
														>
														<div class="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-white" />
														<span
															class="text-[8px] sm:text-[10px] font-black uppercase tracking-wider"
															>{content.publicLabel}</span
														>
													</div>
												</div>
											</div>
											<div
												class="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-brand-muted group-hover:bg-brand-primary group-hover:text-black transition-all shrink-0"
											>
												<Download size={16} />
											</div>
										</a>
									{/each}
								</div>

								<div
									class="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 md:pt-10 gap-6"
								>
									<button
										on:click={prevStep}
										class="text-brand-muted font-black uppercase tracking-widest text-[10px] sm:text-xs hover:text-white transition-colors flex items-center gap-3 py-2"
									>
										<div
											class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center"
										>
											<X size={14} class="rotate-45" />
										</div>
										{content.backBtn || 'Volver'}
									</button>
									<button
										on:click={nextStep}
										class="bg-brand-primary text-black w-full sm:w-auto px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg hover:bg-white transition-all shadow-[0_20px_40px_rgba(197,230,68,0.2)] active:scale-95 uppercase tracking-tighter"
									>
										{content.step2Btn}
									</button>
								</div>
							</div>
						{:else if step === 3}
							<div transition:fly={{ x: 20 }}>
								<div class="mb-8">
									<div class="flex items-center gap-3 mb-3 md:mb-4">
										<Upload class="text-brand-primary" size={20} />
										<div class="h-0.5 w-10 md:w-12 bg-brand-primary/20" />
									</div>
									<h3
										class="text-xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3 text-white tracking-tighter"
									>
										{content.step3Title}
									</h3>
									<p
										class="text-brand-muted text-xs sm:text-base font-medium opacity-70 leading-relaxed max-w-lg"
									>
										{content.step3Desc}
									</p>
								</div>

								<div class="grid grid-cols-1 gap-4">
									{#each content.step3Files as item}
										<div class="relative group">
											<input
												id={item.k}
												type="file"
												multiple={item.k === 'doc5'}
												class="hidden"
												on:change={(e) => handleFileChange(e, item.k)}
											/>
											<div
												class="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 {files[
													item.k
												]?.length > 0
													? 'bg-brand-primary/[0.04] border-brand-primary shadow-[0_10px_30px_-10px_rgba(197,230,68,0.2)]'
													: 'bg-white/[0.02] border-white/5 hover:border-white/20'}"
											>
												<div class="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0 min-w-0 flex-1">
													<div
														class="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 {files[
															item.k
														]?.length > 0
															? 'bg-brand-primary text-black'
															: 'bg-white/5 text-brand-muted group-hover:bg-white/10'}"
													>
														{#if files[item.k]?.length > 0}
															<CheckCircle2 size={20} class="sm:w-6 sm:h-6" />
														{:else}
															<Upload size={18} class="sm:w-5 sm:h-5" />
														{/if}
													</div>
													<div class="flex flex-col min-w-0">
														<span
															class="font-black text-sm sm:text-lg tracking-tight truncate {files[
																item.k
															]?.length > 0
																? 'text-brand-primary'
																: 'text-white'}"
														>
															{item.l}
														</span>
														{#if item.d}
															<span
																class="text-[8px] sm:text-[11px] text-brand-muted font-bold uppercase tracking-wide opacity-50 truncate"
															>
																{item.d}
															</span>
														{/if}
													</div>
												</div>

												<div class="flex items-center justify-between sm:justify-end gap-3">
													{#if files[item.k]?.length > 0}
														<div
															class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end min-w-0"
															transition:scale
														>
															<div class="text-left sm:text-right min-w-0 flex flex-col items-end">
																<p
																	class="text-[10px] sm:text-xs font-black text-white max-w-[100px] sm:max-w-[150px] truncate"
																>
																	{files[item.k].length === 1
																		? files[item.k][0].name
																		: `${files[item.k].length} ${content.filesLabel}`}
																</p>
																<div class="flex items-center gap-2 mt-1">
																	{#if uploadStates[item.k]?.status === 'uploading'}
																		<div class="flex flex-col items-end gap-1">
																			<div
																				class="w-20 sm:w-32 h-1 bg-white/10 rounded-full overflow-hidden"
																			>
																				<div
																					class="h-full bg-brand-primary"
																					style="width: {uploadStates[item.k].progress}%"
																				></div>
																			</div>
																			<span
																				class="text-[7px] sm:text-[9px] text-brand-primary uppercase font-black tracking-widest animate-pulse"
																			>
																				{content.uploading}
																				{Math.round(uploadStates[item.k].progress)}%
																			</span>
																		</div>
																	{:else if uploadStates[item.k]?.status === 'success'}
																		<div class="flex items-center gap-1.5">
																			<span
																				class="text-[8px] sm:text-[10px] text-emerald-400 uppercase font-black tracking-widest uppercase"
																			>
																				{content.uploadSuccess}
																			</span>
																			<CheckCircle2 size={10} class="text-emerald-400" />
																		</div>
																	{/if}
																</div>
															</div>
															<button
																on:click={() => {
																	files[item.k] = [];
																	files = { ...files };
																	delete uploadStates[item.k];
																	uploadStates = { ...uploadStates };
																}}
																aria-label="Quitar archivo"
																class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shrink-0"
															>
																<X size={16} />
															</button>
														</div>
													{:else}
														<label
															for={item.k}
															class="cursor-pointer bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black w-full sm:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-[18px] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 border border-brand-primary/20"
														>
															{content.attach}
														</label>
													{/if}
												</div>
											</div>
										</div>
									{/each}
								</div>

								<div
									class="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 md:pt-10 gap-6"
								>
									<button
										on:click={prevStep}
										class="text-brand-muted font-black uppercase tracking-widest text-[10px] sm:text-xs hover:text-white transition-colors flex items-center gap-3 py-2"
									>
										<div
											class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center"
										>
											<X size={14} class="rotate-45" />
										</div>
										{content.backBtn}
									</button>
									<button
										disabled={isSubmitting || !isStep3Valid}
										on:click={handleSubmit}
										class="relative overflow-hidden transition-all duration-700 h-[56px] sm:h-[64px] {isSubmitting
											? 'bg-brand-primary/90 w-full cursor-not-allowed'
											: !isStep3Valid
												? 'bg-white/10 text-white/30 w-full sm:w-72 cursor-not-allowed border border-white/5'
												: 'bg-brand-primary w-full sm:w-72 hover:bg-white active:scale-[0.98] text-black'} px-12 py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg flex items-center justify-center shadow-2xl shadow-brand-primary/20 uppercase tracking-tighter focus:outline-none"
									>
										{#if isSubmitting}
											<div class="flex items-center gap-4">
												<Loader2 size={20} class="animate-spin text-black" />
												<span
													class="uppercase tracking-[0.2em] text-[8px] sm:text-[10px] font-black"
													>{content.digitalizing}</span
												>
											</div>
										{:else}
											{content.step3Btn}
										{/if}
									</button>
								</div>
							</div>
						{/if}
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
