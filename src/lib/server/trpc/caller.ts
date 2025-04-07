import type { RequestEvent } from '@sveltejs/kit';

import { appRouter } from '$lib/server/trpc/router';
import { createCallerFactory } from '$lib/server/trpc/trpc';
import { createContext } from '$lib/server/trpc/context';

export const createCaller = createCallerFactory(appRouter);
export type TrpcCaller = ReturnType<typeof createCaller>;

export async function createTrpcCaller(
	event: RequestEvent
): Promise<TrpcCaller> {
	return createCaller(await createContext(event));
}
