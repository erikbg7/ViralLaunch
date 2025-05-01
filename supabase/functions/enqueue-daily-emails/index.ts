// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// curl --request POST 'http://127.0.0.1:54321/functions/v1/reddit-active-users' \
//  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ212aWl6cmx5am91ZG5xYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NjY2OTUsImV4cCI6MjA1NTU0MjY5NX0.HNVU6mbY-AtWWqCG1ajvddSXkJsrFEAywL29607MsJ8' \
//  --header 'Content-Type: application/json' \
//  --data '{ "name":"Functions" }'

// Setup type definitions for built-in Supabase Runtime APIs

// This edge function could be entirely replaced by a subabase cron job with a webhook
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6?dts';
import { DateTime } from 'https://esm.sh/luxon@3.4.4';
import type { Database } from '../../supabase.d.ts';

console.log('[REDDIT CRON] Starting...');

const supabase = createClient<Database>(
	Deno.env.get('SUPA_URL')!,
	Deno.env.get('SUPA_SERVICE_KEY')!
);

const queues = createClient(
	Deno.env.get('SUPA_URL')!,
	Deno.env.get('SUPA_SERVICE_KEY')!,
	{
		db: { schema: 'pgmq_public' }
	}
);

Deno.serve(async (req) => {
	const reqSecret = req.headers.get('x-cron-secret');
	const expectedSecret = Deno.env.get('SUPA_CRON_SECRET');

	if (reqSecret !== expectedSecret) {
		return new Response('Unauthorized', { status: 401 });
	}

	console.log('Authorized function call2');

	console.log({ supabase: supabase.schema('public') });

	const nowUtc = DateTime.utc();
	const rounded = nowUtc.set({
		minute: nowUtc.minute < 30 ? 0 : 30,
		second: 0,
		millisecond: 0
	});

	const { data: preferences, error } = await supabase
		.from('preferences')
		.select('*')
		.eq('notificaton_frequency', 'daily');

	if (error) {
		console.error('Error fetching users:', error);
		return new Response('Failed to fetch users', { status: 500 });
	}

	const usersToNotify = preferences.filter((preference) => {
		const formattedUserTime = rounded
			.setZone(preference.time_zone, { keepLocalTime: false })
			.toFormat('HH:mm');
		return formattedUserTime === preference.notification_time;
	});

	console.log(`Enqueuing ${usersToNotify.length} users to Supabase Queue`);

	const enqueueResult = await queues.rpc('send_batch', {
		queue_name: 'daily-emails-queue',
		messages: usersToNotify.map((preferences) => ({ data: preferences }))
	});

	if (enqueueResult.error) {
		console.error(
			`Queue error for ${usersToNotify.length}:`,
			enqueueResult.error
		);
	}

	return new Response(
		`${enqueueResult?.data?.length} Users enqueued to daily-emails-queue`,
		{ status: 200 }
	);
});
