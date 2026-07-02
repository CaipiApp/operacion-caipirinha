import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Pago } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url, params }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resPagos = await api.get({ fetch, endpoint: `pagos`, params: url.searchParams, token })

	if (!resPagos.ok)
		error(404, { message: resPagos?.data?.message });

	const pagosData = resPagos.data as PaginatedResult<Pago>;

	return {
		pagos: pagosData.data,
		meta: pagosData.meta
	};


}

