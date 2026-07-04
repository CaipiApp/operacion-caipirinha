<script lang="ts">
	import { MessageCircle } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	export let lang = 'ES';
</script>

<a
	href="https://wa.me/5493794182462"
	target="_blank"
	rel="noreferrer"
	aria-label={lang === 'PT' ? 'Suporte via WhatsApp' : lang === 'EN' ? 'Support via WhatsApp' : 'Soporte vía WhatsApp'}
	transition:fly={{ y: 20, duration: 600, delay: 500 }}
	class="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] group flex items-center gap-3 active:scale-95 transition-all outline-none"
>
	<div class="relative">
		<div
			class="absolute inset-0 bg-[#25D366] rounded-full blur-[15px] opacity-20 group-hover:opacity-40 animate-pulse transition-opacity"
		/>
		<div
			class="absolute -inset-1 border border-[#25D366]/50 rounded-full animate-[ping_3s_linear_infinite]"
		/>

		<div
			class="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(37,211,102,0.5)] border-2 border-white/20 transition-all duration-300 group-hover:shadow-[0_15px_40px_-5px_rgba(37,211,102,0.6)] group-hover:rotate-12"
		>
			<MessageCircle size={28} class="sm:w-8 sm:h-8" />

			<div class="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#25D366] rounded-full">
				<div class="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
			</div>
		</div>
	</div>

	<div
		class="hidden sm:flex flex-col items-end opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none"
	>
		<div class="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
			<p class="text-[10px] font-black uppercase tracking-widest text-brand-primary leading-none mb-1">
				{lang === 'PT' ? 'FALA CONOSCO' : lang === 'EN' ? 'CHAT WITH US' : 'CHATEÁ CON NOSOTROS'}
			</p>
			<p class="text-white text-xs font-bold whitespace-nowrap">
				{lang === 'PT' ? 'Suporte via WhatsApp' : lang === 'EN' ? 'Support via WhatsApp' : 'Soporte vía WhatsApp'}
			</p>
		</div>
	</div>
</a>
