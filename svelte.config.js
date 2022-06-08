import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import dotenv from 'dotenv';
dotenv.config();

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
		// prerender: {
    //   default: true
    // },
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
			}
		})
	}
};

export default config;
