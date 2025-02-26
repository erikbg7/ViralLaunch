// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// curl --request POST 'http://127.0.0.1:54321/functions/v1/reddit-active-users' \
//  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZ212aWl6cmx5am91ZG5xYXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NjY2OTUsImV4cCI6MjA1NTU0MjY5NX0.HNVU6mbY-AtWWqCG1ajvddSXkJsrFEAywL29607MsJ8' \
//  --header 'Content-Type: application/json' \
//  --data '{ "name":"Functions" }'

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

console.log('[REDDIT CRON] Starting...');

const config = {
	webhookUrl: Deno.env.get('WEBHOOK_URL')!,
	webhookToken: Deno.env.get('WEBHOOK_SECRET')!
};

Deno.serve(async (req) => {
	const { name } = await req.json();
	const data = {
		message: `Hello ${name} motherfuckker!`
	};

	try {
		fetch(config.webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.webhookToken}`
			},
			body: JSON.stringify(data)
		});

		console.log('[REDDIT CRON] Successfully sent webhook');
		return new Response('[REDDIT CRON] Successfully sent webhook');
	} catch (e) {
		console.error('[REDDIT CRON] Error sending webhook', e);
		return new Response('[REDDIT CRON] Error sending webhook', { status: 500 });
	}
});
