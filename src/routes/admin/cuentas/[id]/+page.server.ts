import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Cuenta } from '$lib/models';
import { canAccess } from '$lib/access';

export async function load({ cookies, fetch, params, locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const resCuenta = await api.get({ fetch, endpoint: `cuentas/${params.id}`, token });

	if (!resCuenta.ok)
		error(resCuenta.data?.statusCode || 404, {
			message: resCuenta?.data?.message || 'Conta não encontrada.'
		});

	return {
		cuenta: resCuenta.data as Cuenta
	};
}

export const actions = {
	async default({ params, fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const body = {
			tipo: form.get('tipo')
		};

		const res = await api.patch({
			fetch,
			endpoint: `cuentas/${params.id}`,
			body: JSON.stringify(body),
			token
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'editAccountSuccess' };
	}
};
