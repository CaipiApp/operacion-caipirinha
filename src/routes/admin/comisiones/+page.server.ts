import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Comision } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resComisiones] = await Promise.all([
		api.get({ fetch, endpoint: `comisiones`, token }),
	]);

	if (!resComisiones.ok)
		error(resComisiones.data?.statusCode || 500, { message: resComisiones?.data?.message || 'Empresa não encontrada.' });


	const comisionesData = resComisiones.data as PaginatedResult<Comision>;
	return {
		comisiones: comisionesData.data as Comision[],
		meta: comisionesData.meta,
	};
}

export const actions = {
	async update({ fetch, request, cookies }) {
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
			endpoint: `comisiones/${id}`,
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