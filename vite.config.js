import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
dotenv.config();
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

export default defineConfig(({ command }) => {
	const ssrObj =
		command === 'build'
			? {
					ssr: {
						noExternal: Object.keys(pkg.dependencies || {})
					},
					legacy: { buildSsrCjsExternalHeuristics: true }
			  }
			: {};
	return {
		logLevel: 'info',
		plugins: [sveltekit()],
		...ssrObj,
		server: {
			port: 3000,
			fs: {
				strict: false
			},
			cors: false
		}
	};
});
