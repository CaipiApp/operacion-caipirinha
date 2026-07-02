// Svelte action: fades + translates an element in the first time it enters
// the viewport while scrolling. Skips the effect entirely for users who have
// prefers-reduced-motion enabled, and unobserves after the first reveal so it
// never re-triggers on scroll-up.
export function reveal(node: HTMLElement, params?: { delayMs?: number }) {
	const prefersReducedMotion =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
		return {};
	}

	const delayMs = params?.delayMs ?? 0;

	node.style.opacity = '0';
	node.style.transform = 'translateY(24px)';
	node.style.transition = `opacity 0.6s ease-out ${delayMs}ms, transform 0.6s ease-out ${delayMs}ms`;

	// Defensive: an instant (non-smooth) jump — a direct link to a URL hash,
	// or the browser restoring scroll position on back/forward — can move the
	// viewport past this element without ever passing through it, so the
	// IntersectionObserver below never fires and the element stays invisible
	// forever. If it's already above the fold or already scrolled past on
	// setup, reveal it immediately instead of waiting on the observer.
	const rect = node.getBoundingClientRect();
	const alreadyInOrPastView = rect.top < window.innerHeight;
	if (alreadyInOrPastView) {
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.unobserve(node);
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
