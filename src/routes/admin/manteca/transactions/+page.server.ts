import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Transaction } from '$lib/models/manteca.js';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resTx = await api.get({ fetch, endpoint: `manteca/transactions`, params: url.searchParams, token })

	const data = resTx.data as PaginatedResult<Transaction>;

	return {
		transacciones: data.data,
		meta: data.meta
	};
}

