import { ChartTypes } from '$lib/constants';
import type { Subreddit } from '$lib/server/db/schema';

function createSubredditStore() {
	let selectedChart = $state<ChartTypes>(ChartTypes.HEATMAP);
	let selectedSubreddit = $state<Subreddit | null>(null);
	let selectedSubredditName = $state<string | null>(null);

	return {
		get selectedSubredditName() {
			return selectedSubredditName;
		},
		set selectedSubredditName(value: string | null) {
			selectedSubredditName = value;
		},
		get selectedSubreddit() {
			return selectedSubreddit;
		},
		set selectedSubreddit(value: Subreddit | null) {
			selectedSubreddit = value;
		},
		get selectedChart() {
			return selectedChart;
		},
		set selectedChart(value: ChartTypes) {
			selectedChart = value;
		}
	};
}

let subredditStore = createSubredditStore();
export { subredditStore };
