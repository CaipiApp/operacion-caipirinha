import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');
	
}

export const actions = {
	async default({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const res = await api.post({ fetch, endpoint: `empresas`, body: form, token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'Empresa criada.' };
	}
};
