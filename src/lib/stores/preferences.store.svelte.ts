import { api } from '$lib/api';
import { TimeZone } from '$lib/constants';
import type { RouterOutput } from '$lib/server/trpc/router';
import { serverConfig } from '$lib/stores/settings.svelte';

type PreferencesQuery = ReturnType<typeof api.preferences.get.query>;

export class PreferencesStore {
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
		});
	}
}

export const preferencesStore = new PreferencesStore();
