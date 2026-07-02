import { canAccess } from '$lib/access';
import * as api from '$lib/api';
import type { Empresa, Pagador, Rol } from '$lib/models';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies, fetch, locals, url }) {
	if (!locals.user) redirect(303, '/login');
	if (!canAccess(locals.user, url.pathname)) redirect(303, '/admin');

	const token = cookies.get('token');
	const [resRoles, resEmpresas, resPagadores] = await Promise.all([
		api.get({ fetch, endpoint: `auth/roles`, token }),
		api.get({ fetch, endpoint: `empresas/all`, token }),
		api.get({ fetch, endpoint: `pagador/all`, token })
	]);

	return {
		roles: (resRoles.data as Rol[]) || [],
		empresas: (resEmpresas.data as Empresa[]) || [],
		pagadores: resPagadores.ok ? resPagadores.data as Pagador[] : []
	};
}

export const actions = {
	async default({ fetch, request, cookies }) {
		const token = cookies.get('token');
		const form = await request.formData();

		const roles = form.get('roles')
			? JSON.parse(String(form.get('roles')))?.map(
					(opt: { label: string; value: number }) => opt?.value
				)
			: [];
		if (roles.length === 0) {
			return fail(402, { errors: { roles: 'Adicione pelo menos um rol.' } });
		}

		const password = form.get('password');
		const password2 = form.get('password-repeat');
		const empresaId = form.get('empresa')
			? JSON.parse(String(form.get('empresa')))?.value
			: undefined;
		const pagadorId = form.get('pagadorId')
			? JSON.parse(String(form.get('pagadorId'))).value
			: undefined;

		if (password !== password2) {
			return fail(402, { errors: { password: 'As senhas não coincidem.' } });
		}

		const body = {
			email: String(form.get('email')).toLowerCase(),
			name: form.get('name'),
			password,
			roles,
			empresaId,
			pagadorId,
		};

		const res = await api.post({ fetch, endpoint: `users`, body: JSON.stringify(body), token });

		if (!res?.ok) {
			return fail(res?.data?.statusCode || 500, {
				error: res?.data?.message,
				errors: res?.data?.errors
			});
		}

		return { message: 'newUserSuccess' };
	}
};
