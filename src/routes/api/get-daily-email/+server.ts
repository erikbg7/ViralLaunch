import { json } from '@sveltejs/kit';
import { createTrpcCaller } from '$lib/server/trpc/caller.js';

export async function POST(event) {
	const api = await createTrpcCaller(event);

	try {
		const htmlReport = await api.cron.sendDailyDigestEmail({ email: '' });

		return new Response(htmlReport, {
			headers: {
				'Content-Type': 'text/html'
			}
		});
	} catch (error) {
		console.error('❌ Error rendering email:', error);
		return json({
			status: 500,
			body: 'Error rendering email'
		});
	}
}
