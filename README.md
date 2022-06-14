# Blog made with SvelteKit

## Svelte blog which using Markdown, FE Svelte - SvelteKit, BE Express + SQLite

Server and Client run on the same port - it should check if the build exist and if yes, it will include SSR Sveltekit
<br>
` if (fs.existsSync('../build/handler.js')) { const {handler} = await import('../build/handler.js'); app.use(handler); }`

<br>

- Use **jsonwebtoken** for the Authorization
- Use **express-session** for the session management in Express
- Use language switch with **svelte-i18n**
- Pages and Blogs creation with **marked**
- Use **rxjs** for the Store and some subscriptions(optional)
  <br>

  <img width="400" src="https://res.cloudinary.com/dnpgh1vhi/image/upload/v1655193553/screenshot_2022-06-14_o_9.57.19_kexrkc.png">
