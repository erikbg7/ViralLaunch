import { eq, desc, and, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	product,
	platform,
	platformLaunch,
	type Product,
	type ProductWithPlatforms,
	productSubreddit
} from '$lib/server/db/schema';

export async function getProductsByUserId(userId: string): Promise<Product[]> {
	const products = await db
		.select()
		.from(product)
		.where(eq(product.userId, userId))
		.orderBy(desc(product.createdAt));
	return products;
}

type ProductWithSubreddits = Product & { subreddits_tracked: number };
export async function getUserProductsWithReddits(
	userId: string
): Promise<Array<ProductWithSubreddits>> {
	return await db.transaction(async (tx) => {
		const products = await getProductsByUserId(userId);

		return await Promise.all(
			products.map(async (product) => {
				const subreddits = await tx
					.select()
					.from(productSubreddit)
					.where(eq(productSubreddit.productId, product.id));
				return {
					...product,
					subreddits_tracked: subreddits?.length || 0
				};
			})
		);
	});
}

export async function getProductById(
	userId: string,
	productId: number
): Promise<ProductWithPlatforms | null> {
	// const selected = await db
	// 	.select({ product: product, platform: platform })
	// 	.from(product)
	// 	.leftJoin(platform, eq(product.id, platform.productId))
	// 	.where(and(eq(product.id, productId), eq(product.userId, userId)));

	const result = await db
		.select({
			product: product,
			platform: {
				id: platform.id,
				name: platform.name,
				description: platform.description,
				url: platform.url,
				launched: platformLaunch.launched,
				custom: platform.custom
			}
		})
		.from(product)
		.leftJoin(platformLaunch, eq(product.id, platformLaunch.productId))
		.leftJoin(platform, eq(platformLaunch.platformId, platform.id))
		.where(and(eq(product.id, productId), eq(product.userId, userId)))
		.orderBy(asc(platform.id));

	if (result.length === 0) return null; // If no product found, return null

	// Extract product details (first row contains product info)
	const selectedProduct = result[0];
	// Extract platforms (filter out null values in case no platforms exist)
	const selectedPlatforms = result
		.filter((row) => row.platform.id !== null)
		.map(({ platform: p }) => ({
			id: p.id!,
			name: p.name!,
			description: p.description!,
			url: p.url!,
			launched: p.launched! || false,
			custom: p.custom!
		}));

	return {
		product: selectedProduct!.product,
		platforms: selectedPlatforms
	};
}

export async function createProduct(
	userId: string,
	name: string
): Promise<Product> {
	const [createdProduct] = await db.insert(product).values({
		userId,
		name
	});
	return createdProduct;
}

export async function deleteProduct(
	userId: string,
	id: number
): Promise<Product> {
	const [deletedProduct] = await db
		.delete(product)
		.where(and(eq(product.userId, userId), eq(product.id, id)));

	return deletedProduct;
}

export async function createProductWithDefaultPlatforms(
	userId: string,
	name: string
): Promise<any> {
	return await db.transaction(async (tx) => {
		// Insert the user and return the new user's ID
		const [createdProduct] = await tx
			.insert(product)
			.values({
				userId,
				name
			})
			.returning({ id: product.id });

		if (!createdProduct?.id) throw new Error('Failed to create product');

		const nativePlatformsIds = await tx
			.select({ id: platform.id })
			.from(platform)
			.where(eq(platform.custom, false));

		// Insert the post using the user's ID
		await tx
			.insert(platformLaunch)
			.values(
				nativePlatformsIds.map((p) => ({
					platformId: p.id,
					productId: createdProduct.id
				}))
			);
	});
}
