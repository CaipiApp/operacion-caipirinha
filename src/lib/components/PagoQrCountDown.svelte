<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/translate/i18n';

	export let expires: number;
	export let textColor = 'text-gray-900 dark:text-gray-300';

	let msg = '';

	const calculateTimeRemaining = () => {
		if (!expires) return;
		
		const now: any = new Date();
		const expiration: any = new Date(expires * 1000);
		const diff = expiration - now;

		if (diff <= 0) return;

		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		let text = $t('newPaymentExpirationMsg')
		text = text.replace("{minutes}", `${minutes}`)
		msg = text.replace("{seconds}", `${seconds}`)
	};

	onMount(() => {
		calculateTimeRemaining();
		const interval = setInterval(calculateTimeRemaining, 1000);
		return () => clearInterval(interval);
	});
</script>

<p class="{textColor} text-center">
	<span class="font-popLight">{msg}</span>
</p>
