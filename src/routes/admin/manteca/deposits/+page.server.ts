import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Transaction } from '$lib/models/manteca.js';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resDeposits = await api.get({ fetch, endpoint: `manteca/deposits`, params: url.searchParams, token })

	const data = resDeposits.data as PaginatedResult<Transaction>;

	return {
		depositos: data.data,
		meta: data.meta
	};
}

