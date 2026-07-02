<script lang="ts">
	import { onMount } from 'svelte';

	export let expires: number;

	let msg = '';

	const calculateTimeRemaining = () => {
		if (!expires) return;
		
		const now: any = new Date();
		const expiration: any = new Date(expires * 1000);
		const diff = expiration - now;

		if (diff <= 0) {
			msg = 'La cotización se actualizará en breve';
			return;
		}

		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		msg = `La cotización se actualizará en ${minutes}m ${seconds}s`;
	};

	onMount(() => {
		calculateTimeRemaining();
		const interval = setInterval(calculateTimeRemaining, 1000);
		return () => clearInterval(interval);
	});
</script>

<p class="text-sm font-popMedium">
	<span class="font-popLight">{msg}</span>
</p>
