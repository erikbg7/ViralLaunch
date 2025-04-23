// TODO
// settings store should get all the information from the user preferences when the app is loaded,
// then we save it onto this store so we can use it along the app

import { TimeZone } from '$lib/constants';
import { writable } from 'svelte/store';

export type ServerConfig = { timezone: string };

export const serverConfig2 = writable<ServerConfig>({
	timezone: TimeZone.CET
});

const createServerConfig = () => {
	let timezone = $state<TimeZone>(TimeZone.CET);

	let dateFormatter = $derived.by(() => {
		return new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	});

	return {
		get timezone() {
			return timezone;
		},
		set timezone(value: TimeZone) {
			timezone = value;
		},
		get dateFormatter() {
			return dateFormatter;
		}
	};
};

const serverConfig = createServerConfig();
export { serverConfig };
