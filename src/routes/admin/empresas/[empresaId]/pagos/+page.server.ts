import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Empresa, Pago } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, url, params, locals }) {
	if(!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resEmpresa, resPagos] = await Promise.all([
		api.get({ fetch, endpoint: `empresas/${params.empresaId}`, token }),
		api.get({
			fetch,
			endpoint: `pagos/empresa/${params.empresaId}`,
			params: url.searchParams,
			token
		})
	]);

	if (!resEmpresa.ok)
		error(404, { message: resEmpresa?.data?.message || 'Empresa não encontrada.' });

	const pagosData = resPagos.data as PaginatedResult<Pago>

	return {
		empresa: resEmpresa.data as Empresa,
		pagos: pagosData.data,
		meta: pagosData.meta
	};
}
