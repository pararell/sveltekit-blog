import node from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: node({ out: 'build' }),
		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE']
		},
		serviceWorker: {
			register: false
		},
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			template: 'src/app.html'
		}
	}
};

export default config;
