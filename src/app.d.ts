import type { LoggedUser } from '$lib/models/user.model';
import type { Locale } from '$lib/translate/i18n';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			code?: string;
			message: string;
		}
		interface Locals {
			user?: LoggedUser,
			locale: Locale
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
