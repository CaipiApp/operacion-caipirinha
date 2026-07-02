import { getLandingContent } from '$lib/content/landingContent';

export function load({ locals }) {

	return {
		locale: locals.locale,
		// Contenido base (idioma ES) para el primer render server-side de las
		// rutas de landing. El cliente puede pisarlo si el usuario tiene otro
		// idioma guardado en localStorage (ver LandingRoutePage.svelte).
		landingContent: getLandingContent('ES')
	}
}