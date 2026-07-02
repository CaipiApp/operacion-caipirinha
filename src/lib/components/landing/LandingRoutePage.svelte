<script lang="ts">
	import LandingHome from '$lib/components/landing/LandingHome.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let lang = 'ES';

	function handleLangChange(l: string) {
		lang = l;
		if (browser) {
			localStorage.setItem('caipi_lang', l);
		}
	}

	if (browser) {
		lang = localStorage.getItem('caipi_lang') || 'ES';
	}

	// Contenido pre-cargado en el servidor (idioma ES) para que la landing
	// no dependa de un fetch client-only en el primer render (rompía SSR:
	// sin H1/H2/enlaces internos y LCP alto en mobile).
	$: initialContent = $page.data?.landingContent ?? null;
</script>

<LandingHome {lang} {initialContent} onLangChange={handleLangChange} />
