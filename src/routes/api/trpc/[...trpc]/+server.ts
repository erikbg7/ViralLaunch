import { createTRPCSvelteServer } from 'trpc-svelte-query/server';
import { createContext } from '$lib/server/trpc/context';

import { appRouter } from '$lib/server/trpc/router';
import { redirect } from '@sveltejs/kit';

const trpcServer = createTRPCSvelteServer({
	endpoint: '/api/trpc',
	router: appRouter,
	createContext,
	onError({ error, type, path, input, ctx, req }) {
		if (error.code === 'UNAUTHORIZED') {
			return redirect(302, '/');
		}
		// console.log('[TRPC_ON_ERROR]: ', { path, input, error, type });
		// console.error('[ERROR]: ', error.stack);
		console.error('[TRACE]: ', error.cause);
		// TODO: Send to bug reporting
	}
});

export const GET = trpcServer.handler;
export const POST = trpcServer.handler;
