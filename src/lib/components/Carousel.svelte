<script lang="ts">
	import { onMount } from 'svelte';
	import LandingCard from '$lib/components/LandingCard.svelte';
	import { t } from '$lib/translate/i18n';

	let currentIndex = 10;
	let currentIndexClient = 20;
	let numVisible = 1;
	let autoplay = true;
	let interval: any;

	$: cards = [
		{
			src: '/images/landing/puzzle.png',
			title: $t('benefits.cards.4.title'),
			description: $t('benefits.cards.4.description')
		},
		{
			src: '/images/landing/security.png',
			title: $t('benefits.cards.0.title'),
			description: $t('benefits.cards.0.description')
		},
		{
			src: '/images/landing/energy.png',
			title: $t('benefits.cards.1.title'),
			description: $t('benefits.cards.1.description')
		},
		{
			src: '/images/landing/currency.png',
			title: $t('benefits.cards.2.title'),
			description: $t('benefits.cards.2.description')
		},
		{
			src: '/images/landing/telephone.png',
			title: $t('benefits.cards.3.title'),
			description: $t('benefits.cards.3.description')
		},
		{
			src: '/images/landing/puzzle.png',
			title: $t('benefits.cards.4.title'),
			description: $t('benefits.cards.4.description')
		},
		{
			src: '/images/landing/security.png',
			title: $t('benefits.cards.0.title'),
			description: $t('benefits.cards.0.description')
		},
		{
			src: '/images/landing/energy.png',
			title: $t('benefits.cards.1.title'),
			description: $t('benefits.cards.1.description')
		},
		{
			src: '/images/landing/currency.png',
			title: $t('benefits.cards.2.title'),
			description: $t('benefits.cards.2.description')
		},
		{
			src: '/images/landing/telephone.png',
			title: $t('benefits.cards.3.title'),
			description: $t('benefits.cards.3.description')
		}
	];

	const handleResize = () => {
		switch (true) {
			case window.innerWidth >= 1280:
				numVisible = 4;
				break;
			case window.innerWidth >= 1024:
				numVisible = 3;
				break;
			case window.innerWidth >= 590:
				numVisible = 2;
				break;
			default:
				numVisible = 1;
		}
	};

	const next = () => {
		// currentIndex = (currentIndex + 1) % (cards.length - numVisible + 1);
		// currentIndexClient = currentIndex + 1;
		switch (numVisible) {
			case 4:
				if (currentIndex > 135) {
					currentIndex = 10;
					return;
				}
				break;
			case 3:
				if (currentIndex > 175) {
					currentIndex = 10;
					return;
				}
				break;
			case 2:
				if (currentIndex > 260) {
					currentIndex = 10;
					return;
				}
				break;
			case 1:
				if (currentIndex > 520) {
					currentIndex = 20;
					return;
				}
				break;
		}
		currentIndex += (cards.length - numVisible + 1) * 0.01;
	};

	onMount(() => {
		if (autoplay) {
			interval = setInterval(next, 10);
			document.querySelectorAll('.carousel-btn').forEach((button) => {
				button.addEventListener('click', () => {
					clearInterval(interval);
				});
			});
		}

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});
</script>

<div class="relative max-w-[1920px] mx-auto px-4 sm:px-8">
	<div id="margin-container" class="md:mx-12 max-w-[1720px]">
		<div class="flex" style="transform: translateX({-1 * currentIndex}%)">
			{#each cards as card}
				<div class="flex-none card-width px-4 w-full">
					<LandingCard {...card} />
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	@media (min-width: 1280px) {
		.card-width {
			width: 25%;
		}
	}

	@media (max-width: 1280px) {
		.card-width {
			width: 33%;
		}
	}

	@media (max-width: 1024px) {
		.card-width {
			width: 50%;
		}
	}

	@media (max-width: 590px) {
		#margin-container {
			margin-inline: calc(0.446 * 100vw - 130px);
		}
		.card-width {
			width: 100%;
		}
	}
</style>
