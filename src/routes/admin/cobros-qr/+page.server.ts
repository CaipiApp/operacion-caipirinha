import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { PaginatedResult } from '$lib/models/paginate.model';
import type { PagoStaticQr } from '$lib/models/pagoStaticQr.model';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resQr, resPagos] = await Promise.all([
		api.get({ fetch, endpoint: `static-qr/qr`, token }),
		api.get({ fetch, endpoint: `static-qr`, params: url.searchParams, token }),
	]);

	if (!resQr.ok) {
		error(404, { message: resQr?.data?.message || 'QR não encontrado.' });
	}

	const pagosData = resPagos.data as PaginatedResult<PagoStaticQr>;
	
	return {
		qr: resQr.data?.qr as string,
		pagos: pagosData.data,
		meta: pagosData.meta
	};
};

export const actions: Actions = {
	// Export action - similar to cobros
	create: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const form = await request.formData();

		const montoPesos = parseFloat(form.get('montoPesos') as string);
		if (isNaN(montoPesos) || montoPesos <= 0) {
			return fail(400, { error: 'Monto inválido. Debe ser un número positivo.' });
		}

		const body = {
			montoPesos
		};

		const res = await api.post({ fetch, endpoint: `static-qr`, body: JSON.stringify(body), token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'qr creado.', pagoStaticQr: res.data as PagoStaticQr };
	},
	cancel: async ({ locals, cookies, request }) => {
		if (!locals.user) redirect(303, '/login');

		const token = cookies.get('token');
		const form = await request.formData();
		const id = form.get('id') as string;

		const res = await api.patch({
			fetch,
			endpoint: `static-qr/cancel/${id}`,
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
