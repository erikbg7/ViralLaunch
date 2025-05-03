<script>
	import { preferencesStore } from '$lib/stores/preferences.store.svelte';

	preferencesStore.initialize();

	// TODO: I love the approach as well, as we avoid using trpc at the store,
	// and we just set the values fromt his component:
	// import { api } from '$lib/api';
	// import { preferencesData } from '$lib/stores/preferences.store.svelte';

	// api.subreddit.list.query().subscribe((data) => {
	// 	preferencesData.set(data.data || []);
	// });

	// Then from preferences store
	//export const preferencesData = writable<RouterOutput['subreddit']['list']>();
</script>
