import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Withdraw } from '$lib/models/manteca.js';
import type { PaginatedResult } from '$lib/models/paginate.model.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resWithdraws = await api.get({ fetch, endpoint: `manteca/withdraws`, params: url.searchParams, token });

	const data = resWithdraws.data as PaginatedResult<Withdraw>;

	return {
		retiros: data.data,
		meta: data.meta
	};
}

