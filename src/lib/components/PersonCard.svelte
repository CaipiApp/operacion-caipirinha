<script lang="ts">
	export let src: string;
	export let name: string;
	export let surname: string;
	export let role: string;
</script>

<div class="flex sm:flex-row flex-col sm:items-left gap-4 z-10">
	<div class="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 lg:gap-12">
		<div class="sm:w-[125px] w-[100px] mb-2 lg:w-[200px] lg:h-[200px]">
			<img {src} alt="person" class="lg:w-full" />
		</div>
		<div class="flex flex-col gap-1 sm:items-start items-center my-auto">
			<h2 class="lg:text-3xl sm:text-2xl text-xl text-primary-600 font-gothamBlack">{name}</h2>
			<h2 class=" lg:text-3xl sm:text-2xl text-xl text-primary-600 font-gothamBlack -mt-2">
				{surname}
			</h2>
			<p class="font-robotoRegular tracking-wider text-left text-sm lg:text-base">{role}</p>
			<img src="/images/landing/bar.png" alt="" class="w-[135px] lg:w-[200px]" />
		</div>
	</div>
</div>
