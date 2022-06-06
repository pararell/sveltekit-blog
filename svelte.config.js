import node from '@sveltejs/adapter-node';
import dotenv from 'dotenv';
dotenv.config();

const config = {
	kit: {
		adapter: node({out: 'build'}),
		methodOverride: {
			allowed: ['PUT', 'PATCH', 'DELETE']
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
			}
		})
	}
};

export default config;
