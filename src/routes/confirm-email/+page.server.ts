import { fail } from '@sveltejs/kit';
import { post } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const email = url.searchParams.get('email');

	if (!email) {
		return fail(400, { error: 'emailRequired' });
	}

	try {
		const response = await post({
			fetch,
			endpoint: 'users/confirm-email',
			body: JSON.stringify({ email })
		});

		if (!response.ok) {
			console.error('API Error:', response.data);
			return { success: false, error: 'confirmEmailError' };
		}

		return { success: true, message: 'confirmEmailSuccess' };
	} catch (error) {
		console.error('Error confirming email:', error);
		return { success: false, error: 'confirmEmailError' };
	}
};
