import type { Subreddit } from '$lib/server/db/schema';
import { toast } from 'svelte-sonner';

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
			toast.success('Fake records generated successfully');
		})
		.catch((error) => {
			console.error('Error generating fake records:', error);
			toast.success('Error generating fake records');
		});
}
