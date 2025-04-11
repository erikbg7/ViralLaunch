const debounce = (callback: any, wait: number) => {
	let timeoutId: number | null = null;
	return (...args: any[]) => {
		timeoutId && window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			return callback(...args);
		}, wait);
	};
};

export function debounced<T>(stateGetter: () => T, ms: number) {
	let state = $state(stateGetter());
	const update = debounce((v: T) => (state = v), ms);
	$effect(() => update(stateGetter()));

	return () => state;
}
