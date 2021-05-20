import node from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: node({out: 'build'}),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
