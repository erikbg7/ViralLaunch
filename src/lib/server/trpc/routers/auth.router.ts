import { z } from 'zod';
import { AuthService } from '../../services/auth.service';
import { protectedProcedure, publicProcedure, router } from '../trpc';

const credentialsLoginShema = z.object({
	email: z.string(),
	password: z.string()
});

export const authRouter = router({
	logout: protectedProcedure.mutation(async ({ ctx }) => {
		return await AuthService.logout(ctx.event);
	}),
	login: publicProcedure
		.input(credentialsLoginShema)
		.query(async ({ ctx, input }) => {
			return await AuthService.login(ctx.event, input.email, input.password);
		}),
	loginWithGoogle: publicProcedure.mutation(async ({ ctx }) => {
		return await AuthService.loginWithGoogle(ctx.event);
	})
});
