<script>
	import { Toaster } from 'svelte-french-toast';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import { page } from '$app/stores';
	import 'nprogress/nprogress.css';
	import '../app.css';
	import { browser } from '$app/environment';
	import { getLandingRouteMetadata } from '$lib/components/landing/routeMetadata';

	NProgress.configure({
		// Full list:
		minimum: 0.16
	});

	let pathname = '/';
	let routeMetadata = getLandingRouteMetadata('/');
	let isLandingSeoRoute = false;

	$: {
		if (browser && $navigating) {
			NProgress.start();
		} else NProgress.done();
	}

	$: pathname = $page?.url?.pathname || '/';
	$: routeMetadata = getLandingRouteMetadata(pathname);
	$: isLandingSeoRoute =
		pathname === '/' ||
		pathname === '/caipi-app' ||
		pathname === '/caipi-empresas' ||
		pathname === '/pagos-con-pix' ||
		pathname === '/cobrar-con-pix' ||
		pathname === '/pagos-argentina-brasil' ||
		pathname === '/mercosur';
</script>

<svelte:head>
	<title>{isLandingSeoRoute ? routeMetadata.title : 'Caipi'}</title>
	<meta
		name="description"
		content={isLandingSeoRoute
			? routeMetadata.description
			: 'Pagos y cobros entre Argentina y Brasil.'}
	/>

	<meta property="og:title" content={isLandingSeoRoute ? routeMetadata.title : 'Caipi'} />
	<meta
		property="og:description"
		content={isLandingSeoRoute
			? routeMetadata.description
			: 'Pagos y cobros entre Argentina y Brasil.'}
	/>
	<meta property="og:url" content={isLandingSeoRoute ? routeMetadata.canonical : 'https://caipi.app/'} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Caipi" />
	<meta property="og:image" content={routeMetadata.image} />
	<meta property="og:image:secure_url" content={routeMetadata.image} />
	<meta property="og:image:type" content="image/svg+xml" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Caipi Empresas: conectando el Mercosur"
	/>
	<meta property="og:locale" content="es_AR" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={isLandingSeoRoute ? routeMetadata.title : 'Caipi'} />
	<meta
		name="twitter:description"
		content={isLandingSeoRoute
			? routeMetadata.description
			: 'Pagos y cobros entre Argentina y Brasil.'}
	/>
	<meta name="twitter:image" content={routeMetadata.image} />
	<meta
		name="twitter:image:alt"
		content="Caipi Empresas: conectando el Mercosur"
	/>
	<meta name="twitter:site" content="@caipi_app" />

	<link rel="canonical" href={isLandingSeoRoute ? routeMetadata.canonical : 'https://caipi.app/'} />
	<link rel="apple-touch-icon" href="/caipi_logo_icon.png" />
	<link rel="apple-touch-startup-image" href={routeMetadata.image} />
	<meta name="apple-mobile-web-app-title" content="Caipi" />
	<meta
		name="apple-mobile-web-app-description"
		content="Pagos y cobros entre Argentina, Brasil y el Mercosur."
	/>
</svelte:head>

<slot />

<Toaster />

<style>
	:global(span[class*='min-w-[70px]'][class*='font-display']) {
		min-width: 7.25ch !important;
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'tnum' 1, 'lnum' 1;
		justify-content: flex-start;
	}
</style>
