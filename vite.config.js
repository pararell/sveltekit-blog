import { sveltekit } from '@sveltejs/kit/vite';
import dotenv from 'dotenv';
dotenv.config();
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

const ssrObj =
	process.env.NODE_ENV !== 'development'
		? {
				ssr: {
					noExternal: Object.keys(pkg.dependencies || {})
				}
		  }
		: {};
const config = {
	logLevel: 'info',

	plugins: [
      sveltekit(),       
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    cors: false
  },
  ...ssrObj
};

export default config;