import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(
		JSON.stringify([
			{ id: 1, name: 'Formulario 1', url: 'https://example.com/onboarding.pdf' },
			{ id: 2, name: 'Formulario 2', url: 'https://example.com/terms.pdf' },
			{ id: 3, name: 'Formulario 3', url: 'https://example.com/api-manual.pdf' },
			{ id: 4, name: 'Formulario 4', url: 'https://example.com/planilla.xlsx' }
		]),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
