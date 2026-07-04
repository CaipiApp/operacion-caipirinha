import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(
		JSON.stringify([
			{ id: 1, name: 'DDJJ de Persona Expuesta Políticamente', url: '/resources/formulario-01.docx' },
			{ id: 2, name: 'DDJJ de Sujeto Obligado', url: '/resources/formulario-02.docx' },
			{ id: 3, name: 'DDJJ sobre Beneficiario Final', url: '/resources/formulario-03.docx' },
			{ id: 4, name: 'Documentación requerida para empresas', url: '/resources/formulario-04.docx' }
		]),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
