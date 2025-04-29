import fs from 'fs';
import { compile, preprocess } from 'svelte/compiler';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { render } from 'svelte/server';

// tailwind({
//     content: ['./src/lib/templates/**/*.{html,js,svelte}'],
//     theme: {
//         extend: {}
//     },
//     plugins: []
// })

export const POST = async (event) => {
	// const Component = (await import('../../../../output222222.js')).default;

	// const svelteCompiledComponent = render(Component);

	// console.log({ svelteCompiledComponent });

	const component = fs.readFileSync(
		'./src/lib/templates/test-email.svelte',
		'utf-8'
	);

	const compiledComponent = compile(component, {
		name: 'TestEmail',
		filename: 'test-email.svelte',
		generate: 'server',
		css: 'injected',
		dev: true,
		cssHash: ({ name }) => {
			return `svelte-${name}`;
		}
	});

	const preprocessedComponent = await preprocess(
		compiledComponent.js.code,
		vitePreprocess()
	);

	fs.writeFileSync('output2.js', preprocessedComponent.code);

	// Create SSR payload (a container for styles, output, etc.)
	const payload = {
		out: '',
		css: new Set(),
		head: '',
		title: '',
		html: ''
	};

	const Component = (await import('../../../../tmp/daily-report.compiled.mjs'))
		.default;

	console.log({ Component });
	// const Component = (await import('../../../../output2.js')).default;

	// On deployment, we will generate all output files in the build step
	// and then we will just read the output.js file
	// Call your component (SSR style)
	Component(payload); // empty props, or pass real ones

	// Extract HTML and CSS
	console.log({ payload });
	const renderedHtml = payload.out;
	const styles = [...payload.css].map((s) => s.code).join('\n');

	fs.writeFileSync('output2.html', renderedHtml);

	const fullHtml = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <title>Rendered Email</title>
	  <style>${styles}</style>
	</head>
	<body>
	  ${renderedHtml}
	</body>
	</html>
	`;

	return new Response(fullHtml, {
		headers: {
			'Content-Type': 'text/html'
		}
	});

	// const svelteCompiledComponent = render(TestEmail);

	// const css = fs.readFileSync('./src/lib/templates/email-output.css', 'utf-8');

	// const email =
	// '<head>' +
	// '<style>' +
	// css +
	// '</style>' +
	// '<head>' +
	// '<body>' +
	// svelteCompiledComponent.head +
	// svelteCompiledComponent.body +
	// '</body>';

	// const c = fs.readFileSync('output.js', 'utf-8');
};
