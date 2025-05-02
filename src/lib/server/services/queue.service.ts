import { SUPABASE_SERVICE_KEY, SUPABASE_URL } from '$env/static/private';
import {
	createClient,
	type PostgrestSingleResponse
} from '@supabase/supabase-js';

const supabaseQueue = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
	db: { schema: 'pgmq_public' }
});

type QueueItem<T> = {
	msg_id: number;
	read_ct: number;
	enqueued_at: string; //'2025-05-02T10:59:47.379912+00:00',
	vt: string; //'2025-05-02T11:04:51.403035+00:00',
	message: T;
};

type QueueSendBatch<T> = { queueName: string; messages: T[] };
type QueueSendBatchResult = PostgrestSingleResponse<number[]>;

type QueueRead = { queueName: string; sleepSeconds: number; n: number };
type QueueReadResult<T> = PostgrestSingleResponse<QueueItem<T>[]>;

type QueueDelete = { queueName: string; messageId: number };
type QueueDeleteResult = PostgrestSingleResponse<boolean>;

export class QueueService {
	static async sendBatch<T>({
		queueName,
		messages
	}: QueueSendBatch<T>): Promise<QueueSendBatchResult> {
		return await supabaseQueue.rpc('send_batch', {
			queue_name: queueName,
			messages
		});
	}
	static async read<T>({
		queueName,
		sleepSeconds,
		n
	}: QueueRead): Promise<QueueReadResult<T>> {
		return await supabaseQueue.rpc('read', {
			queue_name: queueName,
			sleep_seconds: sleepSeconds,
			n
		});
	}
	static async delete({
		queueName,
		messageId
	}: QueueDelete): Promise<QueueDeleteResult> {
		return await supabaseQueue.rpc('delete', {
			queue_name: queueName,
			message_id: messageId
		});
	}
}
