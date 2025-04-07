import { z } from 'zod';
import { db } from '$lib/server/db';
import {
	center,
	climbingSession,
	type Center,
	type CenterFilter
} from '$lib/server/db/schema';
import { and, count, eq, getTableColumns, ilike, SQL, asc } from 'drizzle-orm';

export class CenterRepository {
	static async getAllCenters() {
		return await db.select().from(center);
	}

	static async getCenterById(centerId: Center['id'], userId: Center['userId']) {
		const centers = await db
			.select()
			.from(center)
			.where(and(eq(center.userId, userId), eq(center.id, centerId)));
		return centers.at(0) || null;
	}

	static async createCenter(
		name: Center['name'],
		grading: Record<string, string>,
		userId: Center['userId']
	) {
		const [newCenter] = await db
			.insert(center)
			.values({ name, grading, userId })
			.returning(getTableColumns(center));
		return newCenter;
	}

	static async deleteCenter(id: Center['id'], userId: Center['userId']) {
		return await db
			.delete(center)
			.where(and(eq(center.id, id), eq(center.userId, userId)));
	}

	static async findCenters(userId: Center['userId'], filter: CenterFilter) {
		let conditions: SQL[] = [eq(center.userId, userId)];

		if (filter.query) {
			conditions.push(ilike(center.name, `%${filter.query}%`));
		}

		if (filter.centerId) {
			conditions.push(eq(center.id, filter.centerId));
		}

		// if (filter.fromDate) {
		// 	conditions.push(gte(posts.createdAt, filter.fromDate));
		// }
		// if (filter.toDate) {
		// 	conditions.push(lte(posts.createdAt, filter.toDate));
		// }

		const centers = await db
			.select({
				id: center.id,
				name: center.name,
				grading: center.grading,
				sessions: count(climbingSession.id)
			})
			.from(center)
			.leftJoin(climbingSession, eq(center.id, climbingSession.centerId))
			.groupBy(center.id)
			.where(and(...conditions))
			.orderBy(asc(center.name));

		return centers;
	}
}
