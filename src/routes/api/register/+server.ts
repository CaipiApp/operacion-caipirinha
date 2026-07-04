import type { RequestHandler } from '@sveltejs/kit';
import { put, issueSignedToken, presignUrl } from '@vercel/blob';
import nodemailer from 'nodemailer';
import { BLOB_READ_WRITE_TOKEN, SMTP_PASSWORD } from '$env/static/private';

// Orden en el que se piden los documentos en el Paso 3 del formulario
// (RegistrationForm.svelte / translations.ts -> registration.step3Files).
// Este orden define el numero operativo (01, 02, ...) de cada campo.
const DOC_ORDER = ['doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'f1', 'f2', 'f3', 'f4'];

const LINK_VALID_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

const transporter = nodemailer.createTransport({
	host: 'smtpout.secureserver.net',
	port: 465,
	secure: true,
	auth: { user: 'main@caipi.app', pass: SMTP_PASSWORD }
});

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (c) =>
		({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
	);
}

/**
 * Normaliza el nombre de un campo documental (ej. "Contrato Social /
 * Estatutos") a snake_case ascii-safe (ej. "contrato_social_estatutos"),
 * para usar como segmento del nombre operativo del archivo.
 */
function normalizeFieldName(label: string): string {
	const combiningMarks = new RegExp('[\\u0300-\\u036f]', 'g');
	return label
		.normalize('NFD')
		.replace(combiningMarks, '') // quita acentos
		.toLowerCase()
		.replace(/[^a-z0-9\s_-]/g, '') // quita caracteres especiales (ej. "/")
		.trim()
		.replace(/\s+/g, '_');
}

/** Evita caracteres que rompan el pathname de Blob, sin tocar el resto del nombre original. */
function sanitizeOriginalName(name: string): string {
	return name.replace(/[\\/:*?"<>|]/g, '_');
}

/**
 * Nombre operativo de back office: {orden}_{campo}[_{indice}]_{nombre_original}.
 * El indice solo se agrega cuando el campo tiene mas de un archivo (ej. doc5).
 */
function buildOperationalFileName(
	order: number,
	fieldLabel: string,
	originalName: string,
	indexInField?: number
): string {
	const orderStr = String(order).padStart(2, '0');
	const fieldSlug = normalizeFieldName(fieldLabel);
	const safeOriginal = sanitizeOriginalName(originalName);
	const middle = indexInField !== undefined ? `${fieldSlug}_${indexInField}` : fieldSlug;
	return `${orderStr}_${middle}_${safeOriginal}`;
}

type DocMeta = {
	documentOrder: number;
	documentFieldName: string;
	originalFileName: string;
	operationalFileName: string;
	url: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	const businessName = ((formData.get('businessName') as string) ?? '').trim();
	const legalRepresentative = ((formData.get('legalRepresentative') as string) ?? '').trim();
	const email = ((formData.get('email') as string) ?? '').trim();
	const phone = ((formData.get('phone') as string) ?? '').trim();
	const taxId = ((formData.get('taxId') as string) ?? '').trim();
	const businessType = ((formData.get('businessType') as string) ?? '').trim();

	if (!businessName || !email || !legalRepresentative) {
		return new Response(
			JSON.stringify({ success: false, message: 'Faltan datos obligatorios del negocio.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	// Etiquetas de campo documental (ej. doc1 -> "Identidad Apoderados"),
	// enviadas por el cliente desde content.step3Files para no duplicar el
	// copy de traducciones en el servidor.
	let documentFieldLabels: Record<string, string> = {};
	try {
		const raw = formData.get('documentFieldLabels') as string | null;
		if (raw) documentFieldLabels = JSON.parse(raw);
	} catch (err) {
		console.error('Error parsing documentFieldLabels', err);
	}

	// Delegación de lectura de una sola vez, reutilizada para presignar cada
	// documento: evita pedir un signed-token nuevo por cada archivo subido.
	const validUntil = Date.now() + LINK_VALID_MS;
	let delegation;
	try {
		delegation = await issueSignedToken({
			token: BLOB_READ_WRITE_TOKEN,
			operations: ['get'],
			validUntil
		});
	} catch (err) {
		console.error('Error issuing blob signed token', err);
		return new Response(
			JSON.stringify({ success: false, message: 'Error interno al procesar los documentos.' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const requestSlug = `${Date.now()}-${businessName.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`;
	const docs: DocMeta[] = [];

	for (const [fieldIndex, key] of DOC_ORDER.entries()) {
		const documentOrder = fieldIndex + 1;
		const fieldLabel = documentFieldLabels[key] ?? key;
		const files = formData.getAll(key).filter((v): v is File => v instanceof File && v.size > 0);
		const hasMultiple = files.length > 1;

		for (const [idx, file] of files.entries()) {
			const indexInField = hasMultiple ? idx + 1 : undefined;
			const operationalFileName = buildOperationalFileName(
				documentOrder,
				fieldLabel,
				file.name,
				indexInField
			);
			const pathname = `alta-empresa/${requestSlug}/${operationalFileName}`;

			try {
				const arrayBuffer = await file.arrayBuffer();
				const blob = await put(pathname, Buffer.from(arrayBuffer), {
					access: 'private',
					token: BLOB_READ_WRITE_TOKEN,
					contentType: file.type || undefined
				});
				const { presignedUrl } = await presignUrl(delegation, {
					operation: 'get',
					pathname: blob.pathname,
					access: 'private',
					validUntil
				});
				docs.push({
					documentOrder,
					documentFieldName: fieldLabel,
					originalFileName: file.name,
					operationalFileName,
					url: presignedUrl
				});
			} catch (err) {
				console.error(`Error uploading document [${key}]`, err);
				return new Response(
					JSON.stringify({
						success: false,
						message: `Error al subir el documento "${file.name}". Intentá nuevamente.`
					}),
					{ status: 502, headers: { 'Content-Type': 'application/json' } }
				);
			}
		}
	}

	// Divs en vez de <ol>/<li>: un campo con varios archivos repite el mismo
	// documentOrder (5, 5, 5), algo que la numeración nativa de una lista
	// ordenada no puede representar (siempre incrementa 1,2,3...) y además
	// duplicaría el número que ya imprimimos como texto.
	const docListHtml = docs.length
		? docs
				.map(
					(d) =>
						`<div style="margin:4px 0;">${d.documentOrder}. <b>${escapeHtml(d.documentFieldName)}</b> — <a href="${d.url}">${escapeHtml(d.originalFileName)}</a></div>`
				)
				.join('')
		: '<div>Sin documentos adjuntos.</div>';

	const html = `
		<h2>Solicitud de Alta de Empresa</h2>
		<p><b>Nombre comercial:</b> ${escapeHtml(businessName)}</p>
		<p><b>Representante legal:</b> ${escapeHtml(legalRepresentative)}</p>
		<p><b>Tipo:</b> ${escapeHtml(businessType)}</p>
		<p><b>Email:</b> ${escapeHtml(email)}</p>
		<p><b>Teléfono:</b> ${escapeHtml(phone)}</p>
		<p><b>CUIT:</b> ${escapeHtml(taxId)}</p>
		<h3>Documentación (identificada por campo, links válidos por 7 días)</h3>
		${docListHtml}
	`;

	try {
		await transporter.sendMail({
			from: '"Caipi Web" <main@caipi.app>',
			to: 'main@caipi.app',
			replyTo: email,
			subject: `Solicitud Alta Empresa — ${businessName}`,
			html
		});
	} catch (err) {
		console.error('Error sending registration email', err);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'No se pudo enviar la solicitud. Intentá nuevamente en unos minutos.'
			}),
			{ status: 502, headers: { 'Content-Type': 'application/json' } }
		);
	}

	return new Response(
		JSON.stringify({
			success: true,
			message: 'Solicitud enviada con éxito. Procesando en backoffice.'
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
};
