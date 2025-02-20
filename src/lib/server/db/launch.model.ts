import { eq, desc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { launch, platform, type Launch, type ProductWithPlatforms } from '$lib/server/db/schema';

const DEFAULT_LAUNCH_PLATFORMS = [
	{
		name: 'Product Hunt',
		description: 'Product Hunt platform',
		url: 'https://www.producthunt.com/'
	},
	{
		name: 'Indie Hackers',
		description: 'Indie Hackers platform',
		url: 'https://www.indiehackers.com/'
	},
	{
		name: 'Reddit - Entrepreneur',
		description: 'Reddit Entrepreneur platform',
		url: 'https://www.reddit.com/r/Entrepreneur/'
	}
];

export async function getLaunchesByUserId(userId: string): Promise<Launch[]> {
	const launches = await db
		.select()
		.from(launch)
		.where(eq(launch.userId, userId))
		.orderBy(desc(launch.createdAt));
	return launches;
}

export async function getLaunchById(
	userId: string,
	launchId: number
): Promise<ProductWithPlatforms | null> {
	// const selected = await db
	// 	.select({ product: launch, platform: platform })
	// 	.from(launch)
	// 	.leftJoin(platform, eq(launch.id, platform.launchId))
	// 	.where(and(eq(launch.id, launchId), eq(launch.userId, userId)));

	const result = await db
		.select({
			launchId: launch.id,
			launchName: launch.name,
			createdAt: launch.createdAt,
			userId: launch.userId,
			platformId: platform.id,
			platformName: platform.name,
			platformDescription: platform.description,
			platformUrl: platform.url,
			platformLaunched: platform.launched
		})
		.from(launch)
		.leftJoin(platform, eq(launch.id, platform.launchId))
		.where(and(eq(launch.id, launchId), eq(launch.userId, userId)))
		.orderBy(desc(platform.id));

	if (result.length === 0) return null; // If no product found, return null

	// Extract product details (first row contains product info)
	const { launchId: id, launchName: name, createdAt } = result[0];
	// Extract platforms (filter out null values in case no platforms exist)
	const platforms = result
		.filter((row) => row.platformId !== null)
		.map((row) => ({
			id: row.platformId!,
			name: row.platformName!,
			description: row.platformDescription!,
			url: row.platformUrl!,
			launched: row.platformLaunched!,
			launchId: row.launchId!
		}));

	return {
		product: { id, name, createdAt, userId },
		platforms
	};
}

export async function createLaunch(userId: string, name: string): Promise<Launch> {
	const [createdLaunch] = await db.insert(launch).values({
		userId,
		name
	});
	return createdLaunch;
}

export async function createLaunchWithDefaultPlatforms(userId: string, name: string): Promise<any> {
	return await db.transaction(async (tx) => {
		// Insert the user and return the new user's ID
		const [createdLaunch] = await tx
			.insert(launch)
			.values({
				userId,
				name
			})
			.returning({ id: launch.id });

		if (!createdLaunch?.id) throw new Error('Failed to create launch');

		// Insert the post using the user's ID
		await tx
			.insert(platform)
			.values(
				DEFAULT_LAUNCH_PLATFORMS.map((platform) => ({ ...platform, launchId: createdLaunch.id }))
			);
	});
}
