import * as api from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export function load() {
	// Si ya está logueado, no necesita hacer login nuevamente
	// pero mantenemos la página para confirmar el borrado
}

export const actions = {
	async login({ fetch, request, cookies }) {
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
			return { success: true, loggedIn: true };
		}

		return fail(500, { error: 'loginError' });
	},

	async deactivateAccount({ fetch, cookies }) {
		const token = cookies.get('token');
		
		if (!token) {
			return fail(401, { error: 'noToken' });
		}

		const res = await api.post({ 
			fetch, 
			endpoint: 'auth/deactivate-account', 
			token,
			body: JSON.stringify({})
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, { error: 'deactivateAccountError' });
		}

		// Limpiar la cookie del token después de desactivar la cuenta
		cookies.delete('token', { path: '/' });
		
		// Retornar éxito sin redirigir, la redirección se manejará en el frontend
		return { success: true, accountDeleted: true };
	}
};