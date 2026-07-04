import * as api from '$lib/api'
import type { Locale } from '$lib/translate/i18n';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';


export function getClientLocale(clientLang: string | undefined): Locale {
	if (clientLang?.startsWith('pt')) return 'pt';
	if (clientLang?.startsWith('es')) return 'es';

	return 'en';
}

export function getLocale(event: any): Locale {
  const clientLang = event?.request.headers.get('accept-language')
  const locale = event?.cookies.get('locale')
  if(locale && ['en', 'es', 'pt'].includes(locale)) return locale as Locale;

  return getClientLocale(clientLang);
}

const LEGACY_PUBLIC_PATHS = new Set(['/about-us', '/contacts', '/old']);

// Headers de seguridad ausentes hoy en producción (0/7 en la auditoria).
// Se aplican aca porque hooks.server.ts corre en cualquier hosting
// (Docker/VPS con adapter-node o Vercel con adapter-auto), a diferencia de
// una config de nginx que solo cubriria el deploy actual.
function applySecurityHeaders(headers: Headers) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "frame-ancestors 'none'"
    ].join('; ')
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  const normalizedPath = event.url.pathname.replace(/\/+$/, '') || '/';

  if (LEGACY_PUBLIC_PATHS.has(normalizedPath.toLowerCase())) {
    throw redirect(301, 'https://caipi.app/');
  }

  event.locals.locale = getLocale(event)

  const token = event.cookies.get('token');
  if(!token){
    event.locals.user = undefined;
    const response = await resolve(event, { transformPageChunk: ({html}) => html.replace('%LANGUAGE%', event.locals.locale)});
    applySecurityHeaders(response.headers);
    return response;
  }

  const res = await api.get({fetch, endpoint: 'auth/user', token});

  if(res?.ok){
    event.locals.user = res.data;
  }else{
    event.locals.user = undefined;
    event.cookies.delete('token', { secure: false, path: '/' });
  }

	const response = await resolve(event, {
		transformPageChunk: ({html}) => html.replace('%LANGUAGE%', event.locals.locale)});
	applySecurityHeaders(response.headers);
	return response;
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
  console.error("handleError: ", error, event, status, message)

	return {
    message: message
	};
};
