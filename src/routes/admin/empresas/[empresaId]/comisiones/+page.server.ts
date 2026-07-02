import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Empresa } from '$lib/models';
import type {  } from '$lib/models/paginate.model';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, url, params, locals }) {
	if(!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resEmpresa] = await Promise.all([
		api.get({ fetch, endpoint: `empresas/${params.empresaId}`, token }),
	]);

	if (!resEmpresa.ok)
		error(404, { message: resEmpresa?.data?.message || 'Empresa no encontrada.' });

	return {
		empresa: resEmpresa.data as Empresa,
	};
}

export const actions = {
	async update({ params, fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();
		const id = String(form.get('id'))

		if(!id) return fail(500, { error: 'id no valido.' });

		const monto = parseFloat(String(form.get('monto')));

		if(isNaN(monto)) fail(500, { error: 'id no valido.', errors: {monto: "invalid amount."} });
		
		const body = {
			monto
		};

		const res = await api.patch({
			fetch,
			endpoint: `empresas/${params.empresaId}/comisiones/${id}`,
			body: JSON.stringify(body),
			token
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'comision actualizada' };
	}
};
