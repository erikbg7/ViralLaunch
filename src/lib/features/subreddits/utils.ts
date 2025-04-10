import type { Subreddit } from '$lib/server/db/schema';

export function generateFakeRecords(rid: Subreddit['id']) {
	fetch('/api/generate-fake-records', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ subredditId: rid })
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Fake records generated:', data);
		})
		.catch((error) => {
			console.error('Error generating fake records:', error);
		});
}
