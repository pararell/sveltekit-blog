import node from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess({ postcss: true }),
	kit: {
		// adapter: adapter({
		// 	pages: 'build',
		// 	assets: 'build',
		// 	fallback: null,
		// 	precompress: false,
		// 	strict: false
		//   }),
		adapter: node({ out: 'build' }),
		csrf: {
			checkOrigin: false
		},
		serviceWorker: {
			register: false
		}
	}
};

export default config;
