import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Pagador } from '$lib/models';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resPagadores = await api.get({ fetch, endpoint: `pagador`, params: url.searchParams, token })

	const pagadoresData = resPagadores.data as PaginatedResult<Pagador>;

	return {
		pagadores: pagadoresData.data,
		meta: pagadoresData.meta
	};
}

