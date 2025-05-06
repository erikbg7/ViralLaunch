import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export class MailService {
	static async sendDigestEmail(email: string, report: any) {
		// TODO: Implement the email sending logic
	}
	static async sendTestEmail(email: string, report: string) {
		const { data, error } = await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to: ['erik.bg7@gmail.com'],
			subject: 'Hello World',
			html: report
		});

		if (error) {
			return console.error({ error });
		}
		console.log('sent', { data });

		// TODO: Implement the email sending logic
	}
}
