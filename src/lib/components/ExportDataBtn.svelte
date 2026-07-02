<script lang="ts">
	import { enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
	import Spinner from './Icons/Spinner.svelte';
	import { t } from '$lib/translate/i18n';
	import { Button } from 'flowbite-svelte';

	export let render;
	export let columns: Record<string, string>[] = [];
	let sending = false;

	function convertToCSV(data: any) {
		// separado por ; por conflicto con , de los montos.
		const headers = Object.keys(data[0]).join(';') + '\n';
		const rows = data.map((obj: any) => Object.values(obj).join(';')).join('\n');
		return headers + rows;
	}

	function downloadCSV(data: any) {
		const csvContent = convertToCSV(data);
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'data.csv';
		a.click();
		URL.revokeObjectURL(url);
	}

	const handleSubmit = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				// No mostrar todos los campos del pago y tambien traducir a portugues
				const allPagos = result.data.allPagos;
				let dataToShow = allPagos.map((obj : any) => {
					let newObj: any = {};
					for (let col of columns) {
						newObj[col.label] = render(col.key, obj);
					}
					return newObj;
				});
				downloadCSV(dataToShow);
				await update({ reset: false });
			} else {
				toast.error('Ocorreu um erro.');
			}
			sending = false;
		};
	};
</script>

<form method="POST" use:enhance={handleSubmit} class="w-full md:w-fit">
	<Button
		type="submit"
		disabled={sending}
		color="alternative"
		class="uppercase w-full md:w-fit gap-2"
		>{$t('exportDataBtn')}
		{#if sending}
			<Spinner />
		{:else}
			<svg
				class="dark:white black"
				width="16"
				height="16"
				viewBox="0 0 17 19"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M14.502 19C13.8087 19 13.2183 18.7567 12.731 18.27C12.2437 17.7847 12 17.1947 12 16.5C12 16.3667 12.0117 16.229 12.035 16.087C12.0577 15.9443 12.092 15.8103 12.138 15.685L4.396 11.123C4.15133 11.399 3.86667 11.614 3.542 11.768C3.218 11.9227 2.87067 12 2.5 12C1.80533 12 1.21533 11.7573 0.73 11.272C0.243333 10.786 0 10.196 0 9.502C0 8.808 0.243333 8.21767 0.73 7.731C1.21667 7.24433 1.80667 7.00067 2.5 7C2.87067 7 3.218 7.07733 3.542 7.232C3.86667 7.386 4.15133 7.601 4.396 7.877L12.138 3.315C12.092 3.18967 12.0577 3.05567 12.035 2.913C12.0117 2.771 12 2.63333 12 2.5C12 1.80533 12.243 1.21533 12.729 0.73C13.2143 0.243333 13.804 0 14.498 0C15.192 0 15.7823 0.243 16.269 0.729C16.7557 1.215 16.9993 1.80467 17 2.498C17.0007 3.19133 16.7573 3.78167 16.27 4.269C15.7847 4.75633 15.1947 5 14.5 5C14.1293 5 13.782 4.92267 13.458 4.768C13.1333 4.614 12.8487 4.399 12.604 4.123L4.862 8.685C4.908 8.81033 4.94233 8.94367 4.965 9.085C4.98833 9.227 5 9.364 5 9.496C5 9.628 4.98833 9.76633 4.965 9.911C4.94167 10.0557 4.90733 10.1903 4.862 10.315L12.604 14.877C12.8487 14.601 13.1333 14.386 13.458 14.232C13.782 14.0773 14.1293 14 14.5 14C15.1947 14 15.7847 14.243 16.27 14.729C16.7567 15.2143 17 15.804 17 16.498C17 17.192 16.7573 17.7823 16.272 18.269C15.7867 18.7557 15.1967 18.9993 14.502 19ZM14.5 4C14.9113 4 15.2643 3.853 15.559 3.559C15.8537 3.265 16.0007 2.912 16 2.5C15.9993 2.088 15.8523 1.735 15.559 1.441C15.2657 1.147 14.9127 1 14.5 1C14.0873 1 13.7343 1.147 13.441 1.441C13.1477 1.735 13.0007 2.088 13 2.5C12.9993 2.912 13.1463 3.265 13.441 3.559C13.7357 3.853 14.0887 4 14.5 4ZM2.5 11C2.91133 11 3.26433 10.853 3.559 10.559C3.85367 10.265 4.00067 9.912 4 9.5C3.99933 9.088 3.85233 8.735 3.559 8.441C3.26567 8.147 2.91267 8 2.5 8C2.08733 8 1.73433 8.147 1.441 8.441C1.14767 8.735 1.00067 9.088 1 9.5C0.999333 9.912 1.14633 10.265 1.441 10.559C1.73567 10.853 2.08867 11 2.5 11ZM14.5 18C14.9113 18 15.2643 17.853 15.559 17.559C15.8537 17.265 16.0007 16.912 16 16.5C15.9993 16.088 15.8523 15.735 15.559 15.441C15.2657 15.147 14.9127 15 14.5 15C14.0873 15 13.7343 15.147 13.441 15.441C13.1477 15.735 13.0007 16.088 13 16.5C12.9993 16.912 13.1463 17.265 13.441 17.559C13.7357 17.853 14.0887 18 14.5 18Z"
					fill="currentColor"
				/>
			</svg>
		{/if}
	</Button>
</form>
