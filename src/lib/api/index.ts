import { createTRPCSvelte } from 'trpc-svelte-query';
import { httpBatchLink, type TRPCClientErrorLike } from '@trpc/client';
import type { AppRouter } from '$lib/server/trpc/router';
import { transformer } from './transformer';
import { toast } from 'svelte-sonner';

export const api = createTRPCSvelte<AppRouter>({
	links: [
		httpBatchLink({
			url: '/api/trpc'
		})
	],
	transformer
});

export const handleTrpcError = (error: TRPCClientErrorLike<any>) => {
	toast.error(error.message);
};

export type TRPCClientMessage = { text: string };
export const trpcClientMessage = (msg: string): TRPCClientMessage => ({
	text: msg
});
