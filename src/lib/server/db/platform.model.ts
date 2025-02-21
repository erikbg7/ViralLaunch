import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	platform,
	platformLaunch,
	product,
	type Platform,
	type PlatformInsert,
	type PlatformLaunch,
	type Product
} from '$lib/server/db/schema';
import type { User } from 'lucide-svelte';

export async function updatePlatformLaunch(
	userId: User['id'],
	productId: Product['id'],
	platformId: PlatformLaunch['id'],
	launched: PlatformLaunch['launched']
): Promise<void> {
	try {
		// Step 1: Verify that the launch belongs to the user
		const launchExists = await db
			.select({ id: product.id })
			.from(product)
			.where(and(eq(product.id, productId), eq(product.userId, userId)));

		if (launchExists.length === 0) {
			throw new Error('Product not found or does not belong to this user.');
		}
		// // Step 2: Update the `launched` field for all related platforms
		await db
			.update(platformLaunch)
			.set({ launched })
			.where(
				and(eq(platformLaunch.productId, productId), eq(platformLaunch.platformId, platformId))
			);
	} catch (error) {
		console.error(error);
	}
}

export async function createCustomPlatform(
	productId: number,
	platformData: PlatformInsert
): Promise<void> {
	try {
		const [createdPlatform] = await db
			.insert(platform)
			.values({ ...platformData, custom: true })
			.returning({ id: platform.id });

		await db
			.insert(platformLaunch)
			.values({ productId: productId, platformId: createdPlatform.id })
			.returning({ id: platformLaunch.id });
	} catch (error) {
		console.error(error);
	}
}
