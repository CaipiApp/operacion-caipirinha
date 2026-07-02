import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const response = await fetch('https://api.caipi.app/cotizacion', {
			headers: {
				Accept: 'application/json',
				'User-Agent': 'Caipi-App-Server'
			}
		});
		if (!response.ok) {
			throw new Error(`API returned ${response.status}`);
		}
		const data = await response.json();
		return new Response(JSON.stringify(data), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Error proxying cotizacion:', err);
		return new Response(JSON.stringify({ error: 'Failed to fetch from upstream' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
