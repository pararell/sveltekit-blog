# Blog made with SvelteKit

## Svelte blog which using Markdown, FE Svelte - SvelteKit, BE Express + SQLite

Server and Client run on the same port - it should check if the build exist and if yes, it will include SSR Sveltekit
<br/>
` if (fs.existsSync('../build/handler.js')) { const {handler} = await import('../build/handler.js'); app.use(handler); }`

<br/>

<code>git clone https://github.com/pararell/svelte-blog.git </code>
<br/>
<code>npm i</code>

<br/>
<code>cd server npm i</code>

Set .env in main directory and in /server
- adminEmail - email which can add/edit/remove pages and blogs
- disqusSrc - optional to have comments from disqus
- cookieSecret, cookieName, TOKEN_KEY - random string

<code>npm run build</code>
<br/>
<code>cd server npm run dev</code>
<br/>
<br/>

- Use **jsonwebtoken** for the Authorization
- Use **express-session** for the session management in Express
- Use language switch with **svelte-i18n**
- Pages and Blogs creation with **marked**
- Use **rxjs** for the Store and some subscriptions(optional)
  <br>

  <img width="400" src="https://res.cloudinary.com/dnpgh1vhi/image/upload/v1655193553/screenshot_2022-06-14_o_9.57.19_kexrkc.png">
