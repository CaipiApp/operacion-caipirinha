import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Empresa, Pago } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url, params }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const empresa = locals.user.empresas?.[0];
	if (!empresa) throw error(500, { message: 'O usuário não possui uma empresa associada.' });

	const token = cookies.get('token');
	const [resEmpresa, resPagos] = await Promise.all([
		api.get({ fetch, endpoint: `empresas/${empresa.id}`, token }),
		api.get({ fetch, endpoint: `pagos/empresa/${empresa.id}`, params: url.searchParams, token })
	]);

	if (!resEmpresa.ok)
		error(404, { message: resEmpresa?.data?.message || 'Empresa não encontrada.' });

	const pagosData = resPagos.data as PaginatedResult<Pago>;

	return {
		empresa: resEmpresa.data as Empresa,
		pagos: pagosData.data,
		meta: pagosData.meta
	};
}
export const actions = {
	async default({ locals, cookies, fetch, url }) {
		const empresa = locals.user.empresas?.[0];
		if (!empresa) throw error(500, { message: 'O usuário não possui uma empresa associada.' });

		const searchParams = new URLSearchParams(url.search);
		searchParams.delete('page');

		const token = cookies.get('token');
		const resCuentas = await api.get({
			fetch,
			endpoint: `pagos/empresa/${empresa.id}/notpaginated`,
			params: searchParams,
			token
		});
		return {
			allPagos: resCuentas.data as Pago
		};
	}
};
