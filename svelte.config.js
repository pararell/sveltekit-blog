import node from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: node({out: 'build'}),
		target: '#svelte',
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			template: 'src/app.html'
		},
	}
};

export default config;
