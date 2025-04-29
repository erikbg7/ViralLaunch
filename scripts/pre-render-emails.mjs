import { compile } from 'svelte/compiler';
import fs from 'fs/promises';
import path from 'path';

const EMAILS_DIR = path.resolve('src/lib/emails');

// Get all .svelte files in the emails directory
const svelteFiles = await fs.readdir(EMAILS_DIR);
const emailFiles = svelteFiles.filter((file) => file.endsWith('.svelte'));

for (const emailFile of emailFiles) {
	const emailPath = path.join(EMAILS_DIR, emailFile);
	const compiledFile = emailFile.replace('.svelte', '.compiled.mjs');
	const compiledPath = path.join(EMAILS_DIR, compiledFile);

	try {
		// Read the Svelte file
		const source = await fs.readFile(emailPath, 'utf-8');

		// Compile the Svelte component to SSR-compatible JavaScript
		const { js } = compile(source, {
			generate: 'server',
			filename: emailFile
		});

		// Write the compiled file to the __generated folder
		await fs.writeFile(compiledPath, js.code);
		console.log(`✅ Compiled ${emailFile} to ${compiledPath}`);
	} catch (error) {
		console.error(`❌ Failed to compile ${emailFile}:`, error);
	}
}

console.log('✅ All Svelte components compiled at build time.');
