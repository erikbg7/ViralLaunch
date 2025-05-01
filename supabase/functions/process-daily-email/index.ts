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

console.log('[REDDIT CRON] Starting...');

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

	const job = await queues.rpc('read', {
		queue_name: 'daily-emails-queue',
		sleep_seconds: 20,
		n: 1
	});

	if (job.error) {
		console.error('Error fetching users:', job.error);
		return new Response('Error fetching users', { status: 500 });
	}

	console.log({ job });

	const emailPreferences = job.data[0].message;

	console.log('Email preferences:', emailPreferences);

	const res = await fetch(Deno.env.get('VIRAL_MAIL_SENDER_URL')!, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${Deno.env.get('VIRAL_API_KEY')}`
		},
		body: JSON.stringify(emailPreferences.data)
	});

	if (!res.ok) {
		console.log({ res });
		console.error('Error sending email:', res.statusText);
		return new Response('Error sending email - ' + res.statusText, {
			status: 500
		});
	}

	const deleteJob = await queues.rpc('delete', {
		queue_name: 'daily-emails-queue',
		message_id: job.data[0].msg_id
	});

	if (deleteJob.error) {
		console.error('Error deleting job:', deleteJob.error);
		return new Response('Error deleting job', { status: 500 });
	}
	console.log('Job deleted:', deleteJob);

	return new Response(`[QUEUE] Processed job succesully`, { status: 200 });
});
