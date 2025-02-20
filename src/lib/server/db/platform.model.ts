import { eq, desc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { launch, platform, type Launch, type Platform } from '$lib/server/db/schema';
import type { User } from 'lucide-svelte';

export async function getPlatformsByLaunchId(launchId: Launch['id']): Promise<Platform[]> {
	const platforms = await db
		.select()
		.from(platform)
		.where(eq(platform.launchId, launchId))
		.orderBy(desc(launch.createdAt));
	return platforms;
}

export async function updatePlatformLaunched(
	userId: User['id'],
	launchId: Launch['id'],
	platformId: Platform['id'],
	launched: Platform['launched']
): Promise<void> {
	try {
		// Step 1: Verify that the launch belongs to the user
		const launchExists = await db
			.select({ id: launch.id })
			.from(launch)
			.where(and(eq(launch.id, launchId), eq(launch.userId, userId)));

		if (launchExists.length === 0) {
			throw new Error('Launch not found or does not belong to this user.');
		}
		// // Step 2: Update the `launched` field for all related platforms
		await db
			.update(platform)
			.set({ launched })
			.where(and(eq(platform.launchId, launchId), eq(platform.id, platformId)));
	} catch (error) {
		console.error(error);
	}
}

export async function createPlatform(userId: string, name: string): Promise<Launch> {
	const [createdLaunch] = await db.insert(launch).values({
		userId,
		name
	});
	return createdLaunch;
}
