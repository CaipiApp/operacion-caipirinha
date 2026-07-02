import { fail } from '@sveltejs/kit';
import { post } from '$lib/api';
import type { Actions } from './$types';

export const actions: Actions = {
	restore: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');
		if (!email) {
			return fail(400, { error: 'emailRequired' });
		}

		try {
			const response = await post({
				fetch,
				endpoint: 'auth/restore-password',
				body: JSON.stringify({ email })
			});

			if (!response.ok) {
				return fail(400, { error: 'restorePasswordEmailError' });
			}

			return { success: true, message: 'restorePasswordSuccess' };
		} catch (error) {
			console.error('Error restoring password:', error);
			return fail(500, { error: 'restorePasswordEmailError' });
		}
	}
};
