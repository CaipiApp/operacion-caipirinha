import { type RequestHandler } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { PagoStaticQr } from '$lib/models/pagoStaticQr.model';

export const GET: RequestHandler = async ({ cookies, params }) => {
	const token = cookies.get('token');
	const res = await api.get({ fetch, endpoint: `static-qr/${params.id}`, token });

	if (!res.ok) {
		return new Response(JSON.stringify({ error: res?.data?.message || 'Pago no encontrado' }), {
			status: 404
		});
	}

	return new Response(JSON.stringify(res.data as PagoStaticQr), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
