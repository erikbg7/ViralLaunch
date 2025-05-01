import { createTrpcCaller } from '$lib/server/trpc/caller.js';
import type { Preferences } from '$lib/server/db/schema.js';

type Payload = {
	id: Preferences['id'];
	user_id: Preferences['userId'];
	time_zone: Preferences['timezone'];
	week_start: Preferences['weekstart'];
	time_format: Preferences['timeformat'];
	notification_day: Preferences['notificationDay'];
	notification_time: Preferences['notificationTime'];
	notification_email: Preferences['notificationEmail'];
	notificaton_frequency: Preferences['notificationFrequency'];
};

export async function POST(event) {
	console.log('[MAIL] Endpoint called');

	const data = (await event.request.json()) as Payload;

	if (
		!data.notification_email ||
		!data.notification_time ||
		data.notificaton_frequency !== 'daily'
	) {
		console.log('[MAIL] Queue data is not valid');
		return new Response('Malformed queue data, cannot process request', {
			status: 500
		});
	}

	console.log('[MAIL] Data received:', data);

	try {
		const api = await createTrpcCaller(event);
		await api.cron.sendDailyDigestEmail({ email: data.notification_email });

		return new Response('[MAIL] Send succesfully');
	} catch (error) {
		console.error('❌ Error rendering email:', error);
		return new Response('[MAIL] Error sending email', {
			status: 500
		});
	}
}
