import { z } from 'zod';
import { protectedProcedure, router } from '$lib/server/trpc/trpc';
import { CenterService } from '$lib/server/services/center.service';
// import { centerFilterSchema, centerInsertSchema } from '$lib/server/db/schema';

export const centerRouter = router({
	// list: protectedProcedure
	// 	.input(centerFilterSchema.optional())
	// 	.query(({ ctx, input }) => {
	// 		return CenterService.searchCenters(ctx.user.id, input);
	// 	}),
	// get: protectedProcedure
	// 	.input(z.object({ centerId: z.number() }))
	// 	.query(({ ctx, input }) => {
	// 		return CenterService.getById(input.centerId, ctx.user.id);
	// 	}),
	// create: protectedProcedure
	// 	.input(centerInsertSchema.omit({ id: true, userId: true }))
	// 	.mutation(({ input, ctx }) => {
	// 		const grading = input.grading as Record<string, string>;
	// 		return CenterService.createCenter(input.name, grading, ctx.user.id);
	// 	})
});
