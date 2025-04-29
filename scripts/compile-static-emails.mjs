import { createServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

// THIS SCRIPT IS ABLE TO COMPILE SVELTE COMPONENTS TO HTML AND CSS
// AND THEN RUN TAILWINDCSS ON THEM, BUT WE CANNOT SEND PROPS TO THE COMPONENTS
// AND WE CANNOT USE THE SVELTE STORE, SO IT'S NOT REALLY USEFUL
// I LEAVE IT HERE FOR REFERENCE

const EMAILS_DIR = path.resolve('src/lib/emails');
const OUTPUT_DIR = path.resolve('src/lib/emails/__generated');
const TMP_DIR = path.resolve('tmp');
const STYLES_PATH = path.resolve('src/app.css');
const GLOBAL_CSS_OUT = path.resolve(OUTPUT_DIR, 'emails.css');

try {
	// Prepare output and tmp dirs
	await fs.rm(TMP_DIR, { recursive: true, force: true });
	await fs.mkdir(TMP_DIR, { recursive: true });
	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	// Get all .svelte files from EMAILS_DIR
	const dirEntries = await fs.readdir(EMAILS_DIR, { withFileTypes: true });
	const svelteFiles = dirEntries
		.filter((entry) => entry.isFile() && entry.name.endsWith('.svelte'))
		.map((entry) => path.join(EMAILS_DIR, entry.name));

	// Start Vite
	const server = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
		resolve: {
			alias: { $lib: path.resolve('./src/lib') }
		}
	});

	const htmlPaths = [];

	for (const file of svelteFiles) {
		const filename = path.basename(file, '.svelte');
		const outputHtmlPath = path.resolve(OUTPUT_DIR, `${filename}.html`);
		const tmpHtmlPath = path.resolve(TMP_DIR, `${filename}.html`);

		const mod = await server.ssrLoadModule(`/@fs${file}`);
		const Component = mod.default;

		const payload = { out: '' };
		Component(payload, {});
		await fs.writeFile(tmpHtmlPath, payload.out);
		await fs.writeFile(outputHtmlPath, payload.out);
		htmlPaths.push(tmpHtmlPath);

		console.log(`✅ Rendered ${filename}.html`);
	}

	// TailwindCSS command to process all tmp HTMLs
	const contentFiles = htmlPaths.map((p) => `"${p}"`).join(' ');
	const tailwindCommand = `npx tailwindcss -i "${STYLES_PATH}" -o "${GLOBAL_CSS_OUT}" --content ${contentFiles}`;
	execSync(tailwindCommand, { stdio: 'inherit' });

	console.log(`✅ Global CSS written to ${GLOBAL_CSS_OUT}`);

	// Clean up tmp
	await fs.rm(TMP_DIR, { recursive: true, force: true });
	await server.close();
} catch (error) {
	console.error('❌ Failed to generate emails:', error);
}
