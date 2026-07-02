import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ locals, cookies, fetch, url, params }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resPagador = await api.get({ fetch, endpoint: `pagador/details/${params.id}`, params: url.searchParams, token })
	
	if(!resPagador.ok)
		error(404, { message: resPagador?.data?.message });

	return resPagador.data;
}


export const actions = {
	async default({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const cuenta = form.get('cuenta') && JSON.parse(String(form.get('cuenta'))).value;

		if (cuenta === undefined) return fail(402, { errors: { cuenta: 'seleccione una cuenta.' } });
		
		const coin = form.get('coin');
		if (!coin || coin !== 'ARS') return fail(402, { errors: { coin: 'moneda invalida' }});

		const userId = form.get('userId');
		if (!userId) return fail(402, { error: "ocurrio un error." });

		const amount = String(form.get('amount'));

		if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return fail(402, {errors: { amount: "monto invalido."}});

		const body = {
			accountIndex: String(cuenta),
			userId,
			coin,
			amount
		};

		const res = await api.post({ fetch, endpoint: `manteca/withdraw`, body: JSON.stringify(body), token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'retiro exitoso.' };
	}
};
