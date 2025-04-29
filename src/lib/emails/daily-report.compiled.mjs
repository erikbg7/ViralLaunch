import * as $ from 'svelte/internal/server';
import { Button } from '$lib/components/ui/button';
import BestTimesToday from '$lib/features/subreddits/best-times-today.svelte';

export default function Daily_report($$payload, $$props) {
	let { bestTimes } = $$props;

	$$payload.out += `<h1 class="bg-green-400 text-black">This is the daily report</h1> `;

	Button($$payload, {
		onclick: () => alert('hello mellow'),
		children: ($$payload) => {
			$$payload.out += `<!---->Will this work???`;
		},
		$$slots: { default: true }
	});

	$$payload.out += `<!----> `;
	BestTimesToday($$payload, { bestTimes });
	$$payload.out += `<!---->`;
}