import * as api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { canAccess } from '$lib/access';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');
}

export const actions = {
	async default({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const body = {
			key: form.get('key'),
			value: form.get('value'),
			description: form.get('description')
		};

		const res = await api.post({ fetch, endpoint: `config`, body: JSON.stringify(body), token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'Configuração criada.' };
	}
};
