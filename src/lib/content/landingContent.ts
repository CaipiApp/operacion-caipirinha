// Contenido normalizado de la landing (hero, navbar, footer, etc).
// Extraído de src/routes/api/content/+server.ts para poder reutilizarlo
// tanto desde el endpoint HTTP (cambios de idioma en cliente) como desde
// los load() de servidor (SSR del primer render).
import { translations } from '../../routes/api/content/translations';

const BUSINESS_CTA = 'Sumar mi empresa';
const PROCESSED_VOLUME = '$400M+';
const RATING_VALUE = '4.5/5';

const HERO_TITLE = {
	line1: 'Tecnología',
	line2: 'financiera',
	line3: 'para conectar el Mercosur'
};

const HERO_DESCRIPTION =
	'Caipi permite pagar, cobrar y operar entre países con soluciones simples para personas, comercios y empresas. Hoy Argentina y Brasil. Próximamente Paraguay y Uruguay.';

export function normalizeLandingContent(content: any) {
	const heroStats = content.hero?.stats?.map((stat: any, index: number) => {
		if (index === 1) return { ...stat, value: PROCESSED_VOLUME };
		if (index === 2) return { ...stat, value: RATING_VALUE, label: 'Rating' };
		return stat;
	});

	return {
		...content,
		hero: {
			...content.hero,
			title: HERO_TITLE,
			description: HERO_DESCRIPTION,
			ctaMain: BUSINESS_CTA,
			stats: heroStats
		},
		navbar: {
			...content.navbar,
			cta: BUSINESS_CTA
		},
		features: {
			...content.features,
			business: {
				...content.features?.business,
				cta: BUSINESS_CTA
			}
		},
		ctaSection: {
			...content.ctaSection,
			button: BUSINESS_CTA
		}
	};
}

export function getLandingContent(lang: string | undefined) {
	const normalizedLang = (lang || 'ES').toUpperCase();
	const baseContent = translations[normalizedLang] || translations.ES;
	return normalizeLandingContent(baseContent);
}
