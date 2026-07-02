export type RouteMetadata = {
	title: string;
	description: string;
	canonical: string;
	image: string;
};

const SITE_ORIGIN = 'https://caipi.app';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-caipi-v2.svg`;

export const landingRouteMetadata: Record<string, RouteMetadata> = {
	'/': {
		title: 'Caipi | Pagos y cobros entre Argentina, Brasil y el Mercosur',
		description:
			'Pagá con Pix en Brasil, cobrá a clientes brasileños y operá entre Argentina y Brasil mediante una plataforma tecnológica simple, segura e interoperable.',
		canonical: `${SITE_ORIGIN}/`,
		image: DEFAULT_IMAGE
	},
	'/caipi-app': {
		title: 'Caipi App | Pagá con Pix en Brasil desde Argentina',
		description:
			'Usá Caipi App para pagar con Pix en Brasil y operar entre pesos argentinos y reales de forma simple, segura e interoperable.',
		canonical: `${SITE_ORIGIN}/caipi-app`,
		image: DEFAULT_IMAGE
	},
	'/caipi-empresas': {
		title: 'Caipi Empresas | Cobrá con Pix a clientes brasileños',
		description:
			'Caipi Empresas permite a comercios y empresas argentinas cobrar a clientes de Brasil con Pix y liquidar en pesos argentinos.',
		canonical: `${SITE_ORIGIN}/caipi-empresas`,
		image: DEFAULT_IMAGE
	},
	'/pagos-con-pix': {
		title: 'Pagos con Pix | Caipi Argentina Brasil',
		description:
			'Pagá con Pix en Brasil desde Argentina mediante una experiencia simple, trazable y pensada para operar entre ARS y BRL.',
		canonical: `${SITE_ORIGIN}/pagos-con-pix`,
		image: DEFAULT_IMAGE
	},
	'/cobrar-con-pix': {
		title: 'Cobrar con Pix | Cobros de Brasil a Argentina con Caipi',
		description:
			'Cobrá a clientes brasileños mediante Pix y recibí la liquidación en pesos argentinos con una solución comercial simple y segura.',
		canonical: `${SITE_ORIGIN}/cobrar-con-pix`,
		image: DEFAULT_IMAGE
	},
	'/pagos-argentina-brasil': {
		title: 'Pagos Argentina Brasil | Caipi Mercosur',
		description:
			'Operá pagos y cobros entre Argentina y Brasil con una plataforma tecnológica interoperable diseñada para el Mercosur.',
		canonical: `${SITE_ORIGIN}/pagos-argentina-brasil`,
		image: DEFAULT_IMAGE
	},
	'/mercosur': {
		title: 'Caipi Mercosur | Pagos interoperables Argentina Brasil',
		description:
			'Caipi construye infraestructura tecnológica para pagos interoperables entre Argentina, Brasil y la expansión regional del Mercosur.',
		canonical: `${SITE_ORIGIN}/mercosur`,
		image: DEFAULT_IMAGE
	}
};

export function getLandingRouteMetadata(pathname: string): RouteMetadata {
	return landingRouteMetadata[pathname] ?? landingRouteMetadata['/'];
}
