<script>
	import { preferencesStore } from '$lib/stores/preferences.store.svelte';

	preferencesStore.initialize();
	// import { api } from '$lib/api';
	// import { preferencesData } from '$lib/stores/preferences.store.svelte';

	// api.subreddit.list.query().subscribe((data) => {
	// 	preferencesData.set(data.data || []);
	// });
</script>
