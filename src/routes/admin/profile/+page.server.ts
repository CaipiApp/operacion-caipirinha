import * as api from '$lib/api';
import { error, fail, redirect } from '@sveltejs/kit';
import type { User, Empresa, Rol } from '$lib/models';
import { canAccess } from '$lib/access';

export async function load({ cookies, fetch, locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resUser, resEmpresa] = await Promise.all([
		api.get({ fetch, endpoint: `users/${locals.user.id}`, token }),
		api.get({ fetch, endpoint: `empresas/${locals.user.empresas?.[0]?.id}`, token })
	]);

	if (!resUser.ok)
		throw error(resUser.data.statusCode || 404, {
			message: resUser?.data?.message || 'Usuário não encontrado.'
		});
	
	const empresa = resEmpresa.ok ? resEmpresa.data as Empresa : null;

	return {
		usuario: resUser.data as User,
		empresa
	};
}

export const actions = {
	async changePassword({ locals, fetch, request, cookies }) {
		const user = locals.user;
		const token = cookies.get('token');
		const form = await request.formData();

		const password = form.get('password');
		const password2 = form.get('password-repeat');

		if (password !== password2) {
			return fail(402, { errors: { password: 'profileRepeatPasswordError' } });
		}

		const body = {
			password: password,
		};

		const res = await api.patch({
			fetch,
			endpoint: `users/password/${user.id}`,
			body: JSON.stringify(body),
			token
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'profileSuccess' };
	},

	async apikey({ locals, fetch, request, cookies }) {
		const token = cookies.get('token');

		const empresaId = locals.user?.empresas?.[0]?.id;

		const res = await api.post({
			fetch,
			endpoint: `empresas/${empresaId}/apikey`,
			token
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return {message: "ok"};
	},

	async editCallbackUrl({ locals, fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const empresaId = locals.user?.empresas?.[0]?.id;

		const callbackUrl = form.get('callbackUrl');

		const res = await api.post({
			fetch,
			endpoint: `empresas/${empresaId}/callbackUrl`,
			body: JSON.stringify({callbackUrl}),
			token
		});

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return {message: "ok"};
	}
};
