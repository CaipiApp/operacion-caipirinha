import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { PagoStaticQr } from '$lib/models/pagoStaticQr.model';

export const load: PageServerLoad = async ({ locals, cookies, params, url }) => {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const res = await api.get({ fetch, endpoint: `static-qr/${params.id}`, token });

	if (!res.ok) {
		error(404, { message: res?.data?.message || 'Pago no encontrado' });
	}

	return {
		pago: res.data as PagoStaticQr
	};
};

export const actions: Actions = {
	cancel: async ({ locals, cookies, params }) => {
		if (!locals.user) redirect(303, '/login');

		const token = cookies.get('token');
		const res = await api.patch({
			fetch,
			endpoint: `static-qr/cancel/${params.id}`,
			token
		});

		if (!res.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message || 'Error al cancelar el pago'
			});
		}

		return { ok: true, message: 'Pago cancelado' };
	}
};
