<script lang="ts">
	import { Select } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	let cameraId = '';
	let availableDevices = [{ name: 'Selecciona una cámara:', value: '' }];
	let cameraDevices = [];
	let video: HTMLVideoElement;
	const dispatch = createEventDispatcher<{ photoBlob: { blob: Blob } }>();

	let constraints = {
		video: {
			facingMode: { exact: 'environment' },
			width: 2560,
			height: 1440
		}
	};
	async function startCamera(): Promise<void> {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			cameraDevices = devices.filter(
				(device) => device.kind === 'videoinput' && device.label.includes('back')
			);

			if (cameraDevices.length > 1) {
				cameraDevices = cameraDevices.reverse();
				availableDevices = cameraDevices.map((device, i) => {
					return { name: `Cámara ${i + 1}`, value: device.deviceId };
				});
				let bestDevice = cameraDevices[0];
				let allCamerasSameResolution = true;
				for (const device of cameraDevices) {
					if (
						device.getCapabilities().width.max > bestDevice.getCapabilities().width.max &&
						device.getCapabilities().height.max > bestDevice.getCapabilities().height.max
					) {
						bestDevice = device;
						allCamerasSameResolution = false;
					}
				}
				if (allCamerasSameResolution) {
					cameraId = cameraDevices[0].deviceId;
					constraints.video.deviceId = cameraDevices[0].deviceId;
				} else {
					cameraId = bestDevice.deviceId;
					constraints.video.deviceId = cameraId;
				}
			}

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			video.srcObject = stream;
			video.onloadedmetadata = () => video.play();
			video.play();
		} catch (error) {
			console.error('Error de cámara:', error);
		}
	}

	async function stopCamera() {
		const stream = video.srcObject;
		const tracks = stream.getTracks();

		tracks.forEach((track) => track.stop());
		video.srcObject = null;
	}

	async function handleChange() {
		await stopCamera();
		constraints.video.deviceId = cameraId;

		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		video.srcObject = stream;
		video.onloadedmetadata = () => video.play();
	}

	async function takePhoto() {
		// Get access to the canvas context to draw on it
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d')!;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// There's a difference between what is shown to the user and what is captured
		// This ratio rescales the central part to the actual size of the video so that it agrees with what the user actually sees
		const ratio = video.videoWidth / video.clientWidth;

		// DNI's size escaled
		const centralWidth = 316 * ratio;
		const centralHeight = 200 * ratio;

		// Calculate the coordinates for the central part of the video
		const x = (canvas.width - centralWidth) / 2;
		const y = (canvas.height - centralHeight) / 2;

		const centralCanvas = document.createElement('canvas');
		const centralContext = centralCanvas.getContext('2d')!;
		centralCanvas.width = centralWidth;
		centralCanvas.height = centralHeight;

		centralContext.drawImage(
			canvas,
			x,
			y,
			centralWidth,
			centralHeight,
			0,
			0,
			centralWidth,
			centralHeight
		);

		centralCanvas.toBlob((blob) => {
			if (blob) {
				dispatch('photoBlob', { blob });
			}
		});
		await stopCamera();
	}

	startCamera();
</script>

<div class="camera-container bg-darkGray" id="camera-container">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={video} playsinline autoplay></video>
	<div class="text">Enfocá tu DNI en el recuadro.</div>
	<div class="overlay"></div>
	<div class="central-view"></div>
	<div class="button-container">
		<button
			on:click={takePhoto}
			class="font-popMedium text-darkPrimary rounded-3xl w-[316px] bg-white hover:opacity-90 hover:cursor-pointer px-4 py-2"
		>
			Tomar foto
		</button>

		{#if cameraDevices.length > 1}
			<p class="mt-4 text-xs text-center invert">Seleccioná la cámara que tenga mejor definición</p>
			<Select
				placeholder="Elegí la mejor cámara"
				items={availableDevices}
				bind:value={cameraId}
				on:change={handleChange}
				class="mt-4"
			/>
		{/if}
	</div>
</div>

<style>
	video {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		object-fit: cover;
	}

	.camera-container {
		position: relative;
		max-width: 100%;
		height: calc(100dvh);
		overflow: hidden;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.central-view {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 316px;
		height: 200px;
		margin-top: -100px;
		margin-left: -158px;
		border: 2px solid white;
		box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
	}

	.text {
		position: absolute;
		z-index: 1;
		color: white;
		top: 50%;
		margin-top: -150px;
		width: 100%;
		text-align: center;
	}
	.button-container {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 150px;
		transform: translateX(-50%);
		max-width: 640px;
	}
</style>
