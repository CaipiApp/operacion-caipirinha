<div class="loader mx-auto"></div>

<style>
	.loader {
		height: 4px;
		width: 130px;
		--c: no-repeat linear-gradient(#7ab7ff 0 0);
		background: var(--c), var(--c), #fff;
		background-size: 60% 100%;
		animation: l16 3s infinite;
	}
	@keyframes l16 {
		0% {
			background-position:
				-150% 0,
				-150% 0;
		}
		66% {
			background-position:
				250% 0,
				-150% 0;
		}
		100% {
			background-position:
				250% 0,
				250% 0;
		}
	}
</style>
