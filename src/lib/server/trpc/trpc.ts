import { initTRPC, TRPCError } from '@trpc/server';
import { transformer } from '$lib/api/transformer';
import type { Context } from '$lib/server/trpc/context';
import type { Session, User } from '$lib/server/db/schema';
import { SUPABASE_SERVICE_KEY } from '$env/static/private';

const t = initTRPC.context<Context>().create({
	transformer
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
	if (ctx.event.locals.session === null || ctx.event.locals.user === null) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Unauthorized'
		});
	}

	return next({
		ctx: {
			...ctx,
			session: ctx.event.locals.session as Session,
			user: ctx.event.locals.user as User
		}
	});
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
	const authHeader = ctx.event.request.headers.get('Authorization');
	if (!authHeader || authHeader !== `Bearer ${SUPABASE_SERVICE_KEY}`) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Unauthorized admin procedure'
		});
	}
	return next({ ctx });
});

export const router = t.router;

/**
 * Create an unprotected procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * Create an protected procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Create an admin procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const adminProcedure = t.procedure.use(isAdmin);

/**
 * Create a server-side caller
 * @link https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;
