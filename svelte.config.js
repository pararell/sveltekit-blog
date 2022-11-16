import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess({ postcss: true }),
	kit: {
		adapter: node({ out: 'build' }),
		serviceWorker: {
			register: false
		}
	}
};

export default config;
