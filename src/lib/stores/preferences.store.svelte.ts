import { api } from '$lib/api';
import { TimeZone } from '$lib/constants';
import type { RouterOutput } from '$lib/server/trpc/router';
import { serverConfig } from '$lib/stores/settings.svelte';
import { get, readable, writable } from 'svelte/store';

type Preferences = {};

export const preferencesData = writable<RouterOutput['subreddit']['list']>();

let a = preferencesData.subscribe((data) => {
	console.log('data', data);
});

// export const preferences = readable<Preferences>({} as Preferences, (set) => {

type PreferencesQuery = ReturnType<typeof api.preferences.get.query>;

export class PreferencesStore {
	preferences = $state<PreferencesQuery>();
	preferencesData = $derived<PreferencesQuery>(this.preferences?.data || {});
	timezone = $state<TimeZone>(TimeZone.UTC);

	private initialized = false;

	async setPreferences(data: RouterOutput['preferences']['get']) {
		this.timezone = data.timezone;
		serverConfig.init(data);
	}

	async initialize() {
		if (this.initialized) {
			return;
		}
		this.initialized = true;
		api.preferences.get.query().subscribe((query) => {
			serverConfig.loading =
				query.isLoading ||
				query.isRefetching ||
				query.isFetching ||
				!query.data;

			if (query.data) {
				this.setPreferences(query.data);
			}
			this.preferences = query;
		});
	}
}

export const preferencesStore = new PreferencesStore();
