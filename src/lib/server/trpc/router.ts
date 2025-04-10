import { publicProcedure, router } from '$lib/server/trpc/trpc';
import { authRouter } from '$lib/server/trpc/routers/auth.router';
import { centerRouter } from '$lib/server/trpc/routers/center.router';
import { boulderingRouter } from '$lib/server/trpc/routers/bouldering.router';
import { subredditRouter } from '$lib/server/trpc/routers/subreddit.router';
import { recordsRouter } from '$lib/server/trpc/routers/records.router';

export const appRouter = router({
	// auth: authRouter,
	// center: centerRouter,
	// bouldering: boulderingRouter,
	subreddit: subredditRouter,
	records: recordsRouter,
	hello: router({
		get: publicProcedure.query(() => {
			return 'Hello world!';
		})
	})
});

export type AppRouter = typeof appRouter;
