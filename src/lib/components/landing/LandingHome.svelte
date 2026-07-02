<script lang="ts">
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TrustSection from '$lib/components/landing/TrustSection.svelte';
	import FeatureGrid from '$lib/components/landing/FeatureGrid.svelte';
	import Converter from '$lib/components/landing/Converter.svelte';
	import FAQ from '$lib/components/landing/FAQ.svelte';
	import CtaSection from '$lib/components/landing/CtaSection.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import RegistrationForm from '$lib/components/landing/RegistrationForm.svelte';
	import WhatsAppButton from '$lib/components/landing/WhatsAppButton.svelte';

	export let lang = 'ES';
	export let onLangChange: (l: string) => void;
	export let initialContent: any = null;

	let isRegistrationOpen = false;

	function openRegistration() {
		isRegistrationOpen = true;
	}

	function closeRegistration() {
		isRegistrationOpen = false;
	}
</script>

<div
	class="landing-root min-h-screen bg-brand-dark text-white font-sans antialiased overflow-x-hidden selection:bg-brand-primary selection:text-black"
>
	<Navbar onOpenRegistration={openRegistration} currentLang={lang} {onLangChange} {initialContent} />

	<main>
		<Hero {lang} {initialContent} />
		<TrustSection {lang} {initialContent} />
		<FeatureGrid onOpenRegistration={openRegistration} {lang} {initialContent} />
		<Converter {lang} {initialContent} />
		<FAQ {lang} {initialContent} />
		<CtaSection onOpenRegistration={openRegistration} {lang} {initialContent} />
	</main>

	<Footer {lang} {initialContent} />

	<WhatsAppButton {lang} />

	<RegistrationForm isOpen={isRegistrationOpen} onClose={closeRegistration} {lang} />
</div>

<style>
	:global(.landing-root h1),
	:global(.landing-root h2),
	:global(.landing-root h3),
	:global(.landing-root h4),
	:global(.landing-root h5),
	:global(.landing-root h6) {
		font-family: 'Space Grotesk', sans-serif;
		letter-spacing: -0.025em;
		color: #fff;
	}
</style>
