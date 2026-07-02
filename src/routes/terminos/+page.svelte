<script lang="ts">
	import LandingNavbar from '$lib/components/widget/landing/landingNavbar.svelte';
	import Caipi from '$lib/components/Icons/Caipi.svelte';

	export let data;

</script>

<section
	class="w-full bg-black relative font-robotoRegular overflow-hidden flex flex-col min-h-screen"
>
	<div class="relative bg-black flex flex-col w-full 3xl:w-fit 3xl:mx-auto">
		<div
			class="absolute w-[calc(140%)] min-w-[800px] xl:w-full max-w-[1920px] aspect-square lg:top-[10%] md:top-[10%] sm:top-[10%] top-[37%] opacity-50 z-0 3xl:left-0"
			style="background-image: radial-gradient(
			circle at top left,
			#9ecd03 20%,
			black 70%
			);"
		></div>
		<div
			class="2xl:px-24 lg:px-12 sm:p-8 py-8 px-4 text-white sm:rounded-es-[180px] rounded-es-[120px] flex flex-col justify-between relative w-full max-w-[1920px] 3xl:w-[1920px] bg-black flex-grow"
		>
			<LandingNavbar />

			<div class="pt-20 pb-12 max-w-4xl mx-auto">
				<h1 class="text-4xl font-bold mb-8 text-center text-[#9ecd03]">Términos y Condiciones</h1>

				<div class="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
					<div
						class="prose prose-invert prose-sm max-w-none whitespace-pre-line text-gray-300 leading-relaxed"
					>
						{data?.terminosConfig?.description || 'No se han establecido términos y condiciones.'}
					</div>
				</div>

				<div class="mt-8 text-center">
					<a
						href="/"
						class="inline-flex items-center gap-2 text-[#9ecd03] hover:text-[#8ab802] transition-colors"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Volver al inicio
					</a>
				</div>
			</div>
		</div>
		<footer class="2xl:px-24 p-8 pb-4 w-full text-sm text-white flex flex-col justify-between z-0">
			<div class="w-full flex relative z-50">
				<a href="/"><Caipi fill="#fff" class="sm:w-20 w-16 mb-2 flex-none z-50" /></a>
				<div class="sm:space-x-8 space-x-4 w-full flex justify-end">
					<a href="https://x.com/caipi_app" target="_blank">
						<img
							src="/images/landing/xicon.png"
							alt=""
							class="sm:w-8 w-6 h-6 sm:h-8 hover:opacity-70 transition-opacity"
						/>
					</a>
					<a href="https://www.instagram.com/caipi.app/" target="_blank">
						<img
							src="/images/landing/igicon.png"
							alt=""
							class="sm:w-8 w-6 h-6 sm:h-8 hover:opacity-70 transition-opacity"
						/>
					</a>
					<a href="https://www.linkedin.com/company/caipi-app/?viewAsMember=true" target="_blank">
						<img
							src="/images/landing/linkedinicon.png"
							alt=""
							class="sm:w-8 w-6 h-6 sm:h-8 hover:opacity-70 transition-opacity"
						/>
					</a>
				</div>
			</div>
			<div class="z-10">
				<p>© Caipi 2026</p>
			</div>
			<img
				src="/images/landing/hexagons.png"
				alt=""
				class="z-0 absolute bottom-0 left-0 w-[400px] h-[300px] max-w-none 2xl:w-[600px] 2xl:h-[400px]"
			/>
		</footer>
	</div>
</section>

<style>
	:global(body) {
		background-color: #000;
	}
</style>
