import { z } from 'zod';
import { AuthService } from '$lib/server/services/auth/auth.service';
import { OAuthService } from '$lib/server/services/auth/oauth.service';
import {
	protectedProcedure,
	publicProcedure,
	router
} from '$lib/server/trpc/trpc';

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
		return await OAuthService.loginWithGoogle(ctx.event);
	})
});
