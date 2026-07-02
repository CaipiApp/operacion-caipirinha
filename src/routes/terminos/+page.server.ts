import * as api from '$lib/api';
import type { Config } from '$lib/models/config.model';
import { error } from '@sveltejs/kit';

export async function load() {
	const resTerminos = await api.get({
		fetch,
		endpoint: `config/terminos`,
	});
	if (!resTerminos.ok) {
		error(404, { message: resTerminos?.data?.message || 'No se encontraron los terminos y condiciones.' });
	}
	
	return {
		terminosConfig: resTerminos.data as Config
	};
}