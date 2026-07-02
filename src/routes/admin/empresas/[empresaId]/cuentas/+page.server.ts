import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Cuenta, Empresa } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, url, params, locals }) {
	if(!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resEmpresa, resCuentas] = await Promise.all([
		api.get({ fetch, endpoint: `empresas/${params.empresaId}`, token }),
		api.get({
			fetch,
			endpoint: `cuentas/empresa/${params.empresaId}`,
			params: url.searchParams,
			token
		})
	]);

	if (!resEmpresa.ok)
		error(404, { message: resEmpresa?.data?.message || 'Empresa no encontrada.' });

	const cuentasData = resCuentas.data as PaginatedResult<Cuenta>

	return {
		empresa: resEmpresa.data as Empresa,
		cuentas: cuentasData.data,
		meta: cuentasData.meta
	};
}

export const actions = {
	async delete({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();
		const id = form.get('deletedId');

		if (!id) return fail(402, { error: 'Selecione uma conta.' });

		const res = await api.destroy({ fetch, endpoint: `cuentas/${id}`, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'A conta foi excluída.' };
	}
};
