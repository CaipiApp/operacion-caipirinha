// Helpers de mascara/normalizacion/validacion para los campos "Telefono" y
// "CUIT" del formulario de alta de empresa (RegistrationForm.svelte). El
// input siempre muestra el valor "enmascarado" (con espacios/guiones); la
// normalizacion a formato limpio (E.164 / 11 digitos sin guiones) se aplica
// unicamente al armar el payload de submit, nunca al valor mostrado en pantalla.

/**
 * Aplica mascara suave de telefono mientras el usuario escribe.
 * Ej.: "541112345678" -> "+54 11 1234-5678"
 */
export function formatPhone(raw: string): string {
	const digits = raw.replace(/[^\d]/g, '').slice(0, 15);
	if (!digits) return '';

	const cc = digits.slice(0, 2);
	const area = digits.slice(2, 4);
	const first = digits.slice(4, 8);
	const second = digits.slice(8, 12);

	let out = `+${cc}`;
	if (area) out += ` ${area}`;
	if (first) out += ` ${first}`;
	if (second) out += `-${second}`;
	return out;
}

/**
 * Normaliza un telefono (con espacios, guiones, parentesis, etc.) a formato
 * E.164. Si no trae codigo de pais explicito (sin "+" y sin arrancar en 54
 * con longitud internacional), se asume Argentina como pais por defecto,
 * que es el mercado principal de este formulario.
 */
export function normalizePhone(raw: string): string {
	if (!raw) return '';

	const hasPlus = raw.trim().startsWith('+');
	let digits = raw.replace(/[^\d]/g, '');

	if (hasPlus) return `+${digits}`;
	if (digits.startsWith('54') && digits.length >= 12) return `+${digits}`;

	// Numero local: se quita un eventual 0 troncal y se antepone +54.
	digits = digits.replace(/^0+/, '');
	return `+54${digits}`;
}

/** Valida que el telefono tenga entre 8 y 15 digitos reales. */
export function validatePhone(raw: string): boolean {
	const digits = raw.replace(/[^\d]/g, '');
	return digits.length >= 8 && digits.length <= 15;
}

/**
 * Aplica mascara de CUIT mientras el usuario escribe.
 * Ej.: "30123456789" -> "30-12345678-9"
 */
export function formatCUIT(raw: string): string {
	const digits = normalizeCUIT(raw);

	const tipo = digits.slice(0, 2);
	const dni = digits.slice(2, 10);
	const verificador = digits.slice(10, 11);

	let out = tipo;
	if (dni) out += `-${dni}`;
	if (verificador) out += `-${verificador}`;
	return out;
}

/** Normaliza el CUIT a sus 11 digitos, sin guiones ni espacios. */
export function normalizeCUIT(raw: string): string {
	return raw.replace(/\D/g, '').slice(0, 11);
}

/**
 * Valida el CUIT argentino: 11 digitos + digito verificador segun el
 * algoritmo oficial (pesos [5,4,3,2,7,6,5,4,3,2] sobre los primeros 10
 * digitos, modulo 11).
 */
export function validateCUIT(raw: string): boolean {
	const digits = normalizeCUIT(raw);
	if (digits.length !== 11) return false;

	const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
	const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
	const mod = sum % 11;

	let checkDigit = 11 - mod;
	if (checkDigit === 11) checkDigit = 0;
	if (checkDigit === 10) checkDigit = 9;

	return checkDigit === Number(digits[10]);
}
