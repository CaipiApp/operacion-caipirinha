import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Pago } from '$lib/models';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url, params }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resPago = await api.get({ fetch, endpoint: `pagos/details/${params.id}`, params: url.searchParams, token })
	
	if(!resPago.ok)
		error(404, { message: resPago?.data?.message });

	return {
		pago: resPago.data as Pago
	};
}

