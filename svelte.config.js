import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import dotenv from 'dotenv';
dotenv.config();
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);
const ssrObj = process.env.NODE_ENV !== 'development' 
	? {
		ssr: {
			noExternal: Object.keys(pkg.dependencies || {})
		}
	}
	: {};

const config = {
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: node({ out: 'build' }),
		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE']
		},
		serviceWorker: {
			register: false,
		},
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			template: 'src/app.html'
		},
		vite: () => ({
			server: {
				cors: false
			},
			...ssrObj
		})
	}
};

export default config;
