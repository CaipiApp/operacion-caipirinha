<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import NoticiaForm from '$lib/components/forms/NoticiaForm.svelte';
	import { t } from '$lib/translate/i18n';
</script>

<MainCard
	pages={[
		{ href: '/admin/noticias', value: $t('noticiasTitle') },
		{ value: $t('newNoticiaBreadcrumb') }
	]}
>
	<NoticiaForm />
</MainCard>