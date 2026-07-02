import * as api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { canAccess } from '$lib/access';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');
}

export const actions = {
	async default({ fetch, request, cookies, locals }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const empresaId = locals.user.empresas?.[0]?.id;
		if (!empresaId) return fail(401, { error: 'missingEnterpriseId' });

		const body = {
			empresaId,
			tipo: form.get('tipo'),
			clave: form.get('clave'),
			documentNumber:  form.get('documentNumber')
		};

		const res = await api.post({ fetch, endpoint: `cuentas`, body: JSON.stringify(body), token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'newAccountSuccess' };
	}
};
