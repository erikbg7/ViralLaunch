import { createTrpcCaller } from '$lib/server/trpc/caller.js';
import { QueueService } from '$lib/server/services/queue.service.js';
import { PreferencesRepository } from '$lib/server/repositories/preferences.repository.js';
import type { Preferences } from '$lib/server/db/schema.js';

export const POST = async (event) => {
	console.log('[CRON] Webhook called');

	const api = await createTrpcCaller(event);
	const authorization = await api.cron.isAuthorized();

	if (!authorization) {
		return new Response(
			'[CRON] Your are not authorized to access this endpoint',
			{ status: 401 }
		);
	}

	const preferences =
		await PreferencesRepository.getNotificationCompliantUsers();

	const enqueued = await QueueService.sendBatch<Preferences>({
		queueName: 'daily-emails-queue',
		messages: preferences
	});

	if (enqueued.error) {
		return new Response('[CRON] Error enqueuing preferences', { status: 500 });
	}

	return new Response(`[CRON] ${enqueued.data.length} messages enqueued`);
};
