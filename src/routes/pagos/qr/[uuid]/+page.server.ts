import * as api from '$lib/api';
import type { PagoQrLink } from '$lib/models';
import { error, fail } from '@sveltejs/kit';

export async function load({ fetch, url, params }) {
	const resPagoLink = await api.get({
		fetch,
		endpoint: `pagos/qr/link/${params.uuid}`,
		params: url.searchParams
	});

	if (!resPagoLink.ok) {
		error(404, { message: resPagoLink?.data?.message || 'Not found.' });
	}
	const pagoQrLink = resPagoLink.data as PagoQrLink;

	return {
		pagoQrLink
	};
}

export const actions = {
	async default({ fetch, request, params }) {
		const form = await request.formData();

		const body = {
			email: form.get('email'),
			cpf: form.get('cpf'),
		};

		const res = await api.post({ fetch, endpoint: `pagos/qr/link/${params.uuid}`, body: JSON.stringify(body) });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: '', pagoQrLink: res.data as PagoQrLink };
	}
};

