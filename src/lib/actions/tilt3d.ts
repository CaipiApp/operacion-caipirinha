// Svelte action: subtle 3D tilt that follows the cursor, for use inside a
// parent with `perspective` set. Rotation is capped low (max ~7deg) to stay
// tasteful on a fintech product mockup rather than reading as a gimmick.
// No-ops entirely for prefers-reduced-motion or on touch-only devices (no
// hover/mouse), where a tilt-on-cursor effect can't apply anyway.
export function tilt3d(node: HTMLElement, params?: { maxDeg?: number }) {
	const prefersReducedMotion =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const hasHover =
		typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

	if (prefersReducedMotion || !hasHover) {
		return {};
	}

	const maxDeg = params?.maxDeg ?? 7;

	node.style.transition = 'transform 0.15s ease-out';
	node.style.transformStyle = 'preserve-3d';
	node.style.willChange = 'transform';

	function handleMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width; // 0..1
		const y = (e.clientY - rect.top) / rect.height; // 0..1

		const rotateY = (x - 0.5) * 2 * maxDeg;
		const rotateX = (0.5 - y) * 2 * maxDeg;

		node.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
	}

	function handleMouseLeave() {
		node.style.transition = 'transform 0.5s ease-out';
		node.style.transform = 'rotateX(0deg) rotateY(0deg)';
	}

	function handleMouseEnter() {
		node.style.transition = 'transform 0.15s ease-out';
	}

	const parent = node.closest('[data-tilt-zone]') ?? node;
	parent.addEventListener('mousemove', handleMouseMove as EventListener);
	parent.addEventListener('mouseleave', handleMouseLeave);
	parent.addEventListener('mouseenter', handleMouseEnter);

	return {
		destroy() {
			parent.removeEventListener('mousemove', handleMouseMove as EventListener);
			parent.removeEventListener('mouseleave', handleMouseLeave);
			parent.removeEventListener('mouseenter', handleMouseEnter);
		}
	};
}
