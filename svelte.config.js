import node from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-static';

const config = {
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
