import type { RequestHandler } from '@sveltejs/kit';
import { getLandingContent } from '$lib/content/landingContent';

export const GET: RequestHandler = async ({ url }) => {
	const lang = url.searchParams.get('lang') || 'ES';
	const content = getLandingContent(lang);

	return new Response(JSON.stringify(content), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache, no-store, must-revalidate'
		}
	});
};
