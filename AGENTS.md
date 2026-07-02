# AGENTS.md

## Project Overview

This is a SvelteKit frontend application for Caipi (cryptocurrency payment platform) built with TypeScript, Tailwind CSS, and Flowbite components. The app provides payment processing, user management, and administrative functionality.

## Development Commands

### Core Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run check                # Single run
npm run check:watch          # Watch mode

# Linting and formatting
npm run lint                 # Check linting and formatting
npm run format               # Apply Prettier formatting
```

### Testing

⚠️ **No testing framework is currently configured** - no test files or configuration found in the codebase. When implementing tests, consider adding Vitest or Jest.

## Code Style Guidelines

### Import/Export Conventions

- **Path aliases**: Use `$lib/` prefix for internal imports
- **Type imports**: Use `import type` for TypeScript interfaces/types
- **Barrel exports**: Use `index.ts` files for clean re-exports
- **Group imports**: Third-party imports first, then internal imports

```typescript
// ✅ Correct
import { enhance } from '$app/forms';
import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import type { User, Empresa } from '$lib/models';
import { api } from '$lib/api';
import toast from 'svelte-french-toast';
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserForm.svelte`, `PrimaryButton.svelte`)
- **Models**: kebab-case with `.model.ts` suffix (e.g., `user.model.ts`)
- **Utilities**: camelCase (e.g., `api.ts`, `utils.ts`)
- **Routes**: SvelteKit conventions (`+page.svelte`, `+page.server.ts`)
- **Constants**: UPPER_SNAKE_CASE in environment files

### Variable/Function Naming

- **Variables**: camelCase
- **Functions**: camelCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Enums**: PascalCase with string values

```typescript
// ✅ Correct
export enum EstadoPago {
	pendiente = 'pendiente',
	proceso = 'proceso',
	finalizado = 'finalizado'
}

export type User = {
	id: number;
	email: string;
	createdAt: Date;
};
```

### TypeScript Patterns

- **Strict mode enabled**: All TypeScript strict checks are enforced
- **Explicit typing**: Use explicit types for function parameters and returns
- **Type exports**: Use `export type` for interfaces, `export enum` for enums
- **Optional properties**: Use `?` for optional fields

### Component Structure (Svelte files)

Organize `<script>` sections in this order:

```typescript
<script lang="ts">
  // 1. Imports (third-party, then internal)
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';

  // 2. Props/Exports with default values
  export let usuario: User | undefined = undefined;
  export let formAction: string | undefined = undefined;

  // 3. Local state
  let sending = false;
  let error = '';

  // 4. Reactive statements
  $: rolesOpts = roles?.map((rol) => ({ label: rol.nombre, value: rol.id }));

  // 5. Functions
  const handleSubmit = ({}) => {
    // handler logic
  };
</script>

<!-- 6. HTML template -->
<!-- 7. Style block if needed -->
```

### SvelteKit Routing Patterns

- **Layout files**: Use `+layout.svelte` for shared layouts
- **Server actions**: Use `+page.server.ts` with `actions` export
- **Form enhancement**: Use `use:enhance` for progressive enhancement
- **Load functions**: Use `load` function for data fetching

```typescript
// ✅ Server action pattern
export const actions = {
	async login({ fetch, request, cookies }) {
		const form = await request.formData();
		// validation and processing
		if (!res?.ok) {
			return fail(400, { error: 'loginInvalidCredentials' });
		}
		redirect(307, '/admin');
	}
};
```

### Error Handling

- **Form errors**: Use `$page.form?.errors?.fieldName` for validation feedback
- **API errors**: Return `fail()` with error messages from server actions
- **Toast notifications**: Use `svelte-french-toast` for user feedback
- **Try-catch**: Wrap API calls in try-catch blocks

```typescript
// ✅ Error handling pattern
try {
	const res = await api.post({ fetch, endpoint: 'auth/login', body });
	if (result.type === 'success') {
		toast.success($t(result.data?.message));
	} else {
		toast.error(result.data?.error);
	}
} catch (error) {
	toast.error('Unexpected error occurred');
}
```

### API Integration

- **Centralized API**: Use `$lib/api.ts` for all HTTP requests
- **Response wrapper**: Use consistent `Response` type
- **Authentication**: Pass token via Authorization header
- **Type safety**: Use TypeScript interfaces for request/response data

```typescript
// ✅ API usage
const res = await api.post({
	fetch,
	endpoint: 'auth/login',
	body: JSON.stringify({ email, password }),
	token: userToken
});
```

### i18n (Internationalization)

- **Custom implementation**: Uses Svelte stores in `$lib/translate/`
- **Language files**: Organized by feature (e.g., `pt/login.ts`, `pt/users.ts`)
- **Usage**: Use `$t('key')` reactive function in templates
- **Supported languages**: Spanish (es), English (en), Portuguese (pt)

```typescript
// ✅ Translation usage
import { t } from '$lib/translate/i18n';
// In template: {$t('loginEmailLabel')}
```

### Styling Guidelines

- **Tailwind CSS**: Use utility-first approach
- **Flowbite**: Leverage pre-built components
- **Responsive**: Mobile-first design with responsive prefixes
- **Conditional classes**: Use dynamic class binding

```html
<!-- ✅ Styling pattern -->
<div class="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
  <Input
    class="w-full"
    error={$page.form?.errors?.email}
    placeholder={$t('emailPlaceholder')}
  />
</div>
```

### Environment Variables

- **Public vars**: Use `PUBLIC_` prefix, import from `$env/static/public`
- **Type safety**: Import environment variables, don't use `process.env`
- **Available vars**: `PUBLIC_API_URL`, `PUBLIC_WAPP`

```typescript
// ✅ Environment usage
import { PUBLIC_API_URL, PUBLIC_WAPP } from '$env/static/public';
```

### Browser Detection

- **SvelteKit check**: Use `import { browser } from '$app/environment'`
- **Client-side only**: Wrap browser-specific code in `if (browser)` checks

### State Management

- **Svelte stores**: Use built-in stores (`$page`, `$navigating`)
- **Custom hooks**: `useLocalStorage` for persistent state
- **Local state**: Use component variables with reactive statements (`$:`)

### Utility Functions

- **Pure functions**: Place in `$lib/utils.ts`
- **Formatters**: Number/date formatting utilities
- **Validators**: Business logic validation functions
- **Math utilities**: Financial calculation helpers

### Code Quality Enforcement

- **ESLint**: Configured with TypeScript, Svelte, and Prettier rules
- **Prettier**: Configured with tabs, single quotes, 100 char width
- **Type checking**: Strict TypeScript with `npm run check`
- **Linting**: Run `npm run lint` to check both ESLint and Prettier

### File Structure Patterns

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── models/         # TypeScript interfaces and enums
│   ├── translate/      # i18n translation files
│   ├── stores/         # Custom Svelte stores
│   ├── utils.ts        # Utility functions
│   └── api.ts          # API layer
├── routes/             # SvelteKit pages and layouts
└── app.d.ts           # Global type definitions
```

### Development Workflow

1. **Always run `npm run check`** before committing to ensure type safety
2. **Run `npm run lint`** to verify code style compliance
3. **Use `$lib/` imports** for internal modules
4. **Follow naming conventions** consistently
5. **Handle errors gracefully** with toast notifications
6. **Use TypeScript strictly** - avoid `any` types when possible

### Common Gotchas

- **No testing framework** - consider adding Vitest for unit tests
- **Custom i18n** - not a standard library, use the existing pattern
- **Flowbite integration** - leverage existing components over custom CSS
- **Server actions** - use SvelteKit's form enhancement pattern
- **Environment variables** - only public vars available on client-side
