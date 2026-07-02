import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const businessName = formData.get('businessName') as string;
	const email = formData.get('email') as string;

	console.log(`[${new Date().toISOString()}] New registration request received for ${businessName} (${email})`);

	for (const [key, value] of formData.entries()) {
		if (value instanceof File) {
			console.log(`  File [${key}]: ${value.name} (${value.size} bytes)`);
		}
	}

	return new Response(
		JSON.stringify({
			success: true,
			message: 'Solicitud enviada con éxito. Procesando en backoffice.'
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
