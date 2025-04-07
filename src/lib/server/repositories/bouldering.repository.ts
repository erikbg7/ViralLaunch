import { eq, desc, and, sql, getTableColumns } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	boulderingActivity,
	center,
	climbingSession,
	type BoulderingActivity,
	type BoulderingSession,
	type BoulderingGrade,
	type UpdateClimbingSession
} from '$lib/server/db/schema';

const selectActivityMetrics = () => ({
	activities: {
		ascents: sql<number>`COUNT(*) FILTER (WHERE ${boulderingActivity.type} = 'ascent')`,
		attempts: sql<number>`COUNT(*) FILTER (WHERE ${boulderingActivity.type} = 'attempt')`,
		maxAscent: sql<BoulderingGrade>`MAX(${boulderingActivity.grade}) FILTER (WHERE ${boulderingActivity.type} = 'ascent')`
	}
});

export class BoulderingRepository {
	static async getAllSessions(userId: BoulderingSession['userId']) {
		const sessions = await db
			.select({
				...getTableColumns(climbingSession),
				...selectActivityMetrics(),
				center: {
					name: sql<string>`(SELECT ${center.name} FROM ${center} WHERE ${center.id} = ${climbingSession.centerId})`
				}
			})
			.from(climbingSession)
			.where(eq(climbingSession.userId, userId))
			.leftJoin(
				boulderingActivity,
				eq(climbingSession.id, boulderingActivity.sessionId)
			)
			.groupBy(climbingSession.id)
			.orderBy(desc(climbingSession.startedAt));

		return sessions || [];
	}

	static async getSessionById(
		userId: BoulderingSession['userId'],
		sessionId: BoulderingSession['id']
	) {
		const [session] = await db
			.select({
				...getTableColumns(climbingSession),
				...selectActivityMetrics(),
				center
			})
			.from(climbingSession)
			.where(
				and(
					eq(climbingSession.id, sessionId),
					eq(climbingSession.userId, userId)
				)
			)
			.innerJoin(center, eq(climbingSession.centerId, center.id))
			.innerJoin(
				boulderingActivity,
				eq(climbingSession.id, boulderingActivity.sessionId)
			)
			.groupBy(climbingSession.id, center.id);

		return session;
	}

	static async getActiveSession(
		userId: BoulderingSession['userId'],
		sessionId?: BoulderingSession['id']
	) {
		const [activeSession] = await db
			.select()
			.from(climbingSession)
			.where(
				and(
					sessionId ? eq(climbingSession.id, sessionId) : undefined,
					eq(climbingSession.active, true),
					eq(climbingSession.userId, userId)
				)
			);

		return activeSession;
	}

	static async createSession(
		userId: BoulderingSession['userId'],
		centerId: BoulderingSession['centerId']
	) {
		const createdSession = await db
			.insert(climbingSession)
			.values({
				active: true,
				centerId,
				userId,
				startedAt: new Date()
			})
			.returning(getTableColumns(climbingSession));

		return createdSession.at(0);
	}

	static async updateSession(
		userId: BoulderingSession['userId'],
		sessionId: BoulderingSession['id'],
		data: UpdateClimbingSession
	) {
		const [updatedSession] = await db
			.update(climbingSession)
			.set(data)
			.where(
				and(
					eq(climbingSession.userId, userId),
					eq(climbingSession.id, sessionId)
				)
			)
			.returning(getTableColumns(climbingSession));

		return updatedSession;
	}

	static async logActivity(
		type: BoulderingActivity['type'],
		grade: BoulderingActivity['grade'],
		sessionId: BoulderingActivity['sessionId']
	) {
		const [loggedActivity] = await db
			.insert(boulderingActivity)
			.values({
				type,
				grade,
				sessionId
			})
			.returning({ type: boulderingActivity.type });

		return loggedActivity;
	}

	static async getLastActivity(sessionId: BoulderingActivity['sessionId']) {
		const [lastActivity] = await db
			.select()
			.from(boulderingActivity)
			.where(eq(boulderingActivity.sessionId, sessionId))
			.orderBy(desc(boulderingActivity.createdAt))
			.limit(1);

		return lastActivity || null;
	}
}
