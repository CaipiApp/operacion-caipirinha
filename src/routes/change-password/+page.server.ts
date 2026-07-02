import { fail } from '@sveltejs/kit';
import { post } from '$lib/api';
import type { Actions } from './$types';

export const actions: Actions = {
	change: async ({ request, fetch }) => {
		const data = await request.formData();
		const password = data.get('password');
		const confirmPassword = data.get('confirmPassword');
		const token = data.get('token');

		if (!password) {
			return fail(400, { error: 'passwordRequired' });
		}

		if (!confirmPassword) {
			return fail(400, { error: 'confirmPasswordRequired' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'passwordMismatch' });
		}

		if (!token) {
			return fail(401, { error: 'tokenRequired' });
		}

		try {
			const response = await post({
				fetch,
				endpoint: 'auth/new-password',
				body: JSON.stringify({ password }),
				token: token.toString()
			});

			if (!response.ok) {
				console.error('API Error:', response.data);
				return fail(400, { error: 'changePasswordError' });
			}

			return { success: true, message: 'changePasswordSuccess' };
		} catch (error) {
			console.error('Error changing password:', error);
			return fail(500, { error: 'changePasswordError' });
		}
	}
};
