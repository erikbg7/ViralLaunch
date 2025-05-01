import { router } from '$lib/server/trpc/trpc';
import { authRouter } from '$lib/server/trpc/routers/auth.router';
import { subredditRouter } from '$lib/server/trpc/routers/subreddit.router';
import { recordsRouter } from '$lib/server/trpc/routers/records.router';
import { cronRouter } from '$lib/server/trpc/routers/cron.router';
import { preferencesRouter } from '$lib/server/trpc/routers/preferences.router';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const appRouter = router({
	auth: authRouter,
	cron: cronRouter,
	subreddit: subredditRouter,
	records: recordsRouter,
	preferences: preferencesRouter
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
