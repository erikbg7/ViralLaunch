import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import {
	boulderingActivitySelectSchema,
	boulderingActivityInsertSchema,
	climbingSessionSelectSchema,
	climbingSessionUpdateSchema,
	type BoulderingGrade
} from '$lib/server/db/schema';
import { BoulderingService } from '$lib/server/services/bouldering.service';

const searchQuerySchema = z.string().optional();

export const boulderingRouter = router({
	// session: router({
	// 	list: protectedProcedure
	// 		.input(searchQuerySchema)
	// 		.query(({ ctx, input }) => {
	// 			return BoulderingService.getAllSessions(ctx.user.id);
	// 		}),
	// 	get: protectedProcedure
	// 		.input(climbingSessionSelectSchema.pick({ id: true }))
	// 		.query(({ ctx, input }) => {
	// 			return BoulderingService.getSessionById(ctx.user.id, input.id);
	// 		}),
	// 	active: protectedProcedure.query(async ({ ctx }) => {
	// 		return BoulderingService.getActiveSession(ctx.user.id);
	// 	}),
	// 	update: protectedProcedure
	// 		.input(climbingSessionUpdateSchema)
	// 		.mutation(async ({ ctx, input }) => {
	// 			return BoulderingService.updateSession(ctx.user.id, input.id, input);
	// 		}),
	// 	create: protectedProcedure
	// 		.input(climbingSessionSelectSchema.pick({ centerId: true }))
	// 		.mutation(async ({ ctx, input }) => {
	// 			return BoulderingService.createSession(ctx.user.id, input.centerId);
	// 		})
	// }),
	// activity: router({
	// 	last: protectedProcedure
	// 		.input(
	// 			z.object({
	// 				sessionId: boulderingActivitySelectSchema.shape.sessionId.optional()
	// 			})
	// 		)
	// 		.query(({ input }) => {
	// 			return BoulderingService.getLastActivity(input.sessionId);
	// 		}),
	// 	log: protectedProcedure
	// 		.input(
	// 			boulderingActivityInsertSchema.extend({
	// 				sessionId: z.number(),
	// 				grade: z.string()
	// 			})
	// 		)
	// 		.mutation(async ({ ctx, input }) => {
	// 			return BoulderingService.logActivity(
	// 				ctx.user.id,
	// 				input.sessionId,
	// 				input.type,
	// 				input.grade as BoulderingGrade
	// 			);
	// 		})
	// })
});
