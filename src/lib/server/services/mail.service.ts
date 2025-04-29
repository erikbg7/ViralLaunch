import path from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);
const TMP_DIR = path.resolve('tmp');
const EMAILS_DIR = path.resolve('src/lib/emails');
const STYLES_PATH = path.resolve('src/app.css');

export class MailService {
	static async sendDigestEmail(email: string, report: any) {
		// TODO: Implement the email sending logic
	}
	static async buildHtml<T>(template: string, props: T) {
		const filename = template.concat('.svelte');
		const compiledFile = filename.replace('.svelte', '.compiled.mjs');
		const compiledFilePath = path.join(EMAILS_DIR, compiledFile);

		await fs.mkdir(TMP_DIR, { recursive: true });

		// Read the precompiled Svelte component
		const { default: Component } = await import(`file://${compiledFilePath}`);

		// Prepare payload and render the component with props
		const payload = { out: '' };
		Component(payload, props);

		// Save the rendered HTML output
		const outputHtmlPath = path.join(TMP_DIR, `${filename}.html`);
		await fs.writeFile(outputHtmlPath, payload.out);

		// Generate the CSS with Tailwind (only once)
		const tailwindCommand = `npx tailwindcss -i "${STYLES_PATH}" -o "${TMP_DIR}/emails.css" --content "${outputHtmlPath}"`;
		execSync(tailwindCommand, { stdio: 'inherit' });

		// Read the generated CSS file
		const css = await fs.readFile(path.join(TMP_DIR, 'emails.css'), 'utf-8');

		// Clean up the temporary files
		await fs.rm(TMP_DIR, { recursive: true, force: true });

		const htmlReport = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>Rendered Email</title>
					<style>${css}</style>
				</head>
				<body>
					${payload.out}
				</body>
			</html>
		`;

		return htmlReport;
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
