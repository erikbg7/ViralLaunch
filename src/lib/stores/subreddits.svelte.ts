import { ChartTypes } from '$lib/constants';

function createSubredditStore() {
	let selectedChart = $state(ChartTypes.LINEAR);

	return {
		get selectedChart() {
			return selectedChart;
		},
		set selectedChart(value) {
			selectedChart = value;
		}
	};
}

let subredditStore = createSubredditStore();
export { subredditStore };
