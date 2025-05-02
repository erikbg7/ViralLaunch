import { json } from '@sveltejs/kit';
import { createTrpcCaller } from '$lib/server/trpc/caller.js';
import { QueueService } from '$lib/server/services/queue.service.js';
import type { Preferences } from '$lib/server/db/schema.js';

export const POST = async (event) => {
	console.log('[CRON] Webhook called');

	const api = await createTrpcCaller(event);
	const authorization = await api.cron.isAuthorized();

	if (!authorization) {
		return new Response('Your are not authorized to access this endpoint', {
			status: 401
		});
	}

	const queueItems = await QueueService.read<Preferences>({
		queueName: 'daily-emails-queue',
		sleepSeconds: 10,
		n: 1
	});

	if (queueItems.error) {
		console.error('Error fetching users:', queueItems.error);
		return new Response('Error fetching users', { status: 500 });
	}

	let message = queueItems.data[0].message;

	await api.cron.sendDailyDigestEmail({
		email: message.notificationEmail
	});

	await QueueService.delete({
		queueName: 'daily-emails-queue',
		messageId: queueItems.data[0].msg_id
	});

	return json({ t: '[CRON] Email sent.' });
};
