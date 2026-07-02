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

export const handle: Handle = async ({ event, resolve }) => {
  const normalizedPath = event.url.pathname.replace(/\/+$/, '') || '/';

  if (LEGACY_PUBLIC_PATHS.has(normalizedPath.toLowerCase())) {
    throw redirect(301, 'https://caipi.app/');
  }

  event.locals.locale = getLocale(event)

  const token = event.cookies.get('token');
  if(!token){
    event.locals.user = undefined;
    return await resolve(event, { transformPageChunk: ({html}) => html.replace('%LANGUAGE%', event.locals.locale)});
  }

  const res = await api.get({fetch, endpoint: 'auth/user', token});

  if(res?.ok){
    event.locals.user = res.data;
  }else{
    event.locals.user = undefined;
    event.cookies.delete('token', { secure: false, path: '/' });
  }

	return await resolve(event, {
		transformPageChunk: ({html}) => html.replace('%LANGUAGE%', event.locals.locale)});
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
  console.error("handleError: ", error, event, status, message)

	return {
    message: message
	};
};
