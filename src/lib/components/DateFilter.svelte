<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { t } from '$lib/translate/i18n';
	import { Input, Label } from 'flowbite-svelte';

	function handleDateChange(e: any) {
		$page.url.searchParams.set('page', '1');
		const value = e?.target?.value;
		const name = e?.target?.name;
		if (!value) {
			$page.url.searchParams.delete(name);
		} else {
			$page.url.searchParams.set(name, value);
		}
		goto(`${$page.url.pathname}?${$page.url.searchParams}`, {
			replaceState: true,
			invalidateAll: true
		});
	}
</script>

<div class="flex md:flex-row flex-col md:items-center items-start md:gap-2 gap-0 w-full md:w-auto">
	<Label class="mb-2 md:mb-[0px] font-popMedium">{`${$t('dateFilterFrom')}:`}</Label>
	<Input
		type="date"
		name="from"
		on:change={handleDateChange}
		value={$page.url.searchParams.get('from') || ''}
	/>
</div>
<div class="flex md:flex-row flex-col md:items-center items-start md:gap-2 gap-0 w-full md:w-auto">
	<Label class="mb-2 md:mb-[0px] font-popMedium">{`${$t('dateFilterTo')}:`}</Label>
	<Input
		type="date"
		name="to"
		on:change={handleDateChange}
		value={$page.url.searchParams.get('to') || ''}
	/>
</div>
