import * as api from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export function load({ locals, request, url }) {
	if (locals.user) {
		redirect(307, '/admin');
	}
}

export const actions = {
	async login({ fetch, request, cookies, url }) {
		const form = await request.formData();

		const body = {
			email: form.get('email'),
			password: form.get('password')
		};

		const res = await api.post({ fetch, endpoint: 'auth/login', body: JSON.stringify(body) });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: 'loginInvalidCredentials' });
		}

		if (res?.data?.access_token) {
			cookies.set('token', res?.data?.access_token, { secure: false, path: '/' });
		}

		redirect(307, '/admin');
	}
};
